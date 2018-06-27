import React, { Component } from 'react';
import injectSheet from 'react-jss';
import Loader from './Loader';

import DayNumbers from './Pixels/DayNumbers';
import EditPixel from './Pixels/EditPixel';
import Month from './Pixels/Month';
import NewPixel from './Pixels/NewPixel';

const styles = {
  container: {
    display: `flex`,
    width: `100%`,
    flexDirection: `row`,
    zIndex: `999`,
    position: `absolute`,
    top: `90px`,
    left: `0`,
    justifyContent: `flex-start`
  },
  grid: {
    width: `max-content`,
    display: `grid`,
    marginLeft: `120px`,
    gridTemplateColumns: `repeat(13, 30px)`,
    alignSelf: `flex-start`,
    justifySelf: `flex-start`,
    color: `#363636`,
  },
  description: {
    display: `flex`,
    width: `100%`,
    height: `100%`,
    flexDirection: `row`,
    justifyContent: `center`
  }
};

class Pixels extends Component {
  constructor(props) {
    super(props);
    this.getUserMoods = this.getUserMoods.bind(this);
    this.getPixelMoods = this.getPixelMoods.bind(this);
    this.editPixel = this.editPixel.bind(this);
    this.editPixelRef = React.createRef();
    this.state = {
      months: [],
      userMoods: [],
      pixelMoods: null,
      editPixel: false,
      editdayID: null,
      editDate: null,
      editJournal: "",
      editMoods: null
    }
  }
  render() {
    const { classes } = this.props;
    if (this.state.pixelMoods !== null) {
      this.year = new Date().getFullYear();
      let months = new Array(12);
      const { pixelMoods } = this.state;
      for (let i = 0; i < 12; i++) {
        let moods = [];
        for (let j = 0; j < pixelMoods.length; j++) {
          let mood = pixelMoods[j];
          let moodDate = new Date(+mood.date);
          if (moodDate.getMonth() === i) {
            moods.push(mood)
          }
        }
        months[i] = moods;
      }
      return (
        <div className={classes.container}>
          {
            this.state.pixelMoods !== null ? (
              <div className={classes.grid}>
                <DayNumbers />
                {
                  months.map((month, index) => {
                    if (month.length > 0) {
                      return <Month editPixel={this.editPixel} date={new Date(this.year, index, 1).getTime()} key={index} userMoods={this.state.userMoods} pixelMoods={month} />
                    } else {
                      return <Month editPixel={this.editPixel} date={new Date(this.year, index, 1).getTime()} key={index} userMoods={this.state.userMoods} />
                    }
                  })
                }
              </div>
            ) : <Loader />
          }
          <div className={classes.description}>
            {this.state.editPixel ? (
              <EditPixel
                dayID={this.state.editdayID}
                date={this.state.editDate}
                journal={this.state.editJournal}
                moods={this.state.editMoods}
                userMoods={this.state.userMoods}
                refreshPixelMoods={this.getPixelMoods}
                messages={this.props.messages}
                renderMessages={this.props.renderMessages}
                resizeBackground={this.props.resizeBackground} />
            ) : (
                <NewPixel
                  date={this.state.editDate}
                  userMoods={this.state.userMoods}
                  messages={this.props.messages}
                  renderMessages={this.props.renderMessages}
                  refreshPixelMoods={this.getPixelMoods}
                  resizeBackground={this.props.resizeBackground} />
              )
            }
          </div>
        </div>
      );
    } else {
      return <Loader />
    }
  }
  async editPixel(dayID, moods, journal, date) {
    if (moods) {
      // for every mood, append it's name and color by it's id
      for (let i = 0; i < moods.length; i++) {
        let moodID = moods[i].moodId;
        for (let j = 0; j < this.state.userMoods.length; j++) {
          let userMood = this.state.userMoods[j];
          if (moodID === userMood.moodID) {
            moods[i].moodName = userMood.moodName;
            moods[i].moodColor = userMood.moodColor;
          }
        }
      }
    }
    if (dayID) {
      this.setState({
        editdayID: dayID,
        editMoods: moods,
        editJournal: journal,
        editDate: date,
        editPixel: true
      });
    } else {
      this.setState({
        editdayID: dayID,
        editMoods: moods,
        editJournal: journal,
        editDate: date,
        editPixel: false
      });
    }
  }
  componentDidMount() {
    this.props.removeMessages();
    this.props.resizeBackground();
  }
  componentDidUpdate() {
    this.props.resizeBackground();
  }
  async componentWillMount() {
    await this.getUserMoods();
    await this.getPixelMoods();
  }
  getUserMoods() {
    return new Promise(resolve => {
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', `https://api.yearsinpixels.com/api/user/mood`, true);
        httpRequest.setRequestHeader("x-access-token", `${token}`);
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
                let response = JSON.parse(httpRequest.responseText);
                this.setState({ userMoods: response.moods });
              } else {
                this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
                let response = JSON.parse(httpRequest.responseText);
                if (response.hasOwnProperty('errors')) {
                  response.errors.map(err => console.log(err));
                } else if (response.hasOwnProperty('error')) {
                  console.log(response.error)
                } else {
                  console.log(response.message);
                }
                this.props.renderMessages();
              }
              return resolve(true);
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.props.messages.push({ text: e, type: "error" });
            this.props.renderMessages();
          }
        }
      }
    });
  }
  getPixelMoods() {
    return new Promise(resolve => {
      this.setState({ pixelMoods: null });
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', `https://api.yearsinpixels.com/api/mood`, true);
        httpRequest.setRequestHeader("x-access-token", `${token}`);
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
                let response = JSON.parse(httpRequest.responseText);
                this.setState({ pixelMoods: response.moods });
              } else {
                this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
                let response = JSON.parse(httpRequest.responseText);
                if (response.hasOwnProperty('errors')) {
                  response.errors.map(err => console.log(err));
                } else if (response.hasOwnProperty('error')) {
                  console.log(response.error)
                } else {
                  console.log(response.message);
                }
                this.props.renderMessages();
              }
              return resolve(true);
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.props.messages.push({ text: e, type: "error" });
            this.props.renderMessages();
          }
        }
      }
    });
  }
}

export default injectSheet(styles)(Pixels);