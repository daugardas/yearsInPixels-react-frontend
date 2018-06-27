import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    width: `400px`
  },
  date: {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    fontSize: `30px`,
    position: `relative`
  },
  emotions: {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    '& span': {
      alignSelf: `center`,
      fontSize: `35px`,
      color: `#364d6b`
    }
  },
  emotionsList: {
    display: `flex`,
    width: `100%`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  emotion: {
    width: `100%`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    '& select': {
      width: `100%`,
      fontSize: `24px`,
      border: `2px solid #dbf0fd`,
      borderRadius: `8px`,
      color: `#4D6E99`,
      appearance: `none`,
      textAlign: `center`,
      background: `url(https://png.icons8.com/ios/150/3584fc/chevron-down-filled.png) 96% / 7% no-repeat white`,
      paddingRight: `32px`,
      paddingLeft: `10px`,
      transition: `border-color 0.1s linear`,
      height: `40px`,
      // testing child hover, if not do it & select:hover
      '&:hover': {
        cursor: `pointer`,
        borderColor: `#8AB2E6`
      }
    }
  },
  removeEmotion: {
    marginLeft: `12px`,
    fontSize: `22px`,
    color: `#cc2828`,
    '&:hover': {
      color: `#991e1e`,
      cursor: `pointer`
    }
  },
  addEmotion: {
    display: `flex`,
    margin: `5px 0`,
    alignItems: `center`,
    justifyContent: `center`,
    '& i': {
      fontSize: `25px`,
      color: `#73E673`,
      '&:hover': {
        cursor: `pointer`,
        color: `#59B359`
      }
    }
  },
  journal: {
    display: `block`,
    resize: `none`,
    fontSize: `18px`,
    fontFamily: `'Kalam', cursive`,
    border: `2px solid #dbf0fd`,
    borderRadius: `8px`,
    padding: `5px`,
    color: `#4D6E99`,
    transition: `border-color 0.2s linear`,
    width: `400px`,
    '&:focus': {
      borderColor: `#8AB2E6`
    }
  },
  buttonContainer: {
    display: `flex`,
    width: `100%`,
    alignItems: `center`,
    justifyContent: `center`,
    '& button': {
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
      marginTop: `10px !important`,
      width: `100%`,
      padding: `8px 4px`,
      background: `#eef9ff`,
      fontSize: `25px`,
      margin: `0 10px`,
      border: `5px solid #dbf0ff`,
      borderRadius: `30px`,
      transition: `font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease`,
      alignSelf: `center`,
      '&:hover': {
        fontWeight: `700`,
        cursor: `pointer`,
        transform: `scale(1.02)`
      }
    }
  }
};

class NewPixel extends Component {
  constructor(props) {
    super(props);
    this.addNewEmotion = this.addNewEmotion.bind(this);
    this.handleJournalChange = this.handleJournalChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.submitPixelData = this.submitPixelData.bind(this);
    let date = this.props.date ? new Date(this.props.date) : new Date();
    this.state = {
      date: date.setHours(0, 0, 0, 0),
      dateInputValue: this.formatDate(`#YYYY#-#MM#-#DD#`, date),
      emotions: [
        { moodId: this.props.userMoods[0].moodID, percentage: 100 }
      ],
      journal: "",
      addNewEmotions: true
    };
  }
  render() {
    const { userMoods, classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.date}>Date: {this.state.dateInputValue}</div>
        <div className={classes.emotions}>
          <span>How did you feel?</span>
          {this.state.emotions.map((mood, moodIndex) => {
            return (
              <div className={classes.emotionsList} key={`select-${moodIndex}`}>
                <div className={classes.emotion}>
                  <select id={`emotions-select-${moodIndex}`} value={this.state.emotions[moodIndex].moodId} onChange={this.handleSelectChange.bind(this, moodIndex)}>
                    {
                      userMoods.map((mood, userIndex) => <option key={`option-${userIndex}`} value={mood.moodID}>{mood.moodName}</option>)
                    }
                  </select>
                  {this.state.emotions.length > 1 ? <input type="range" id={`emotions-range-${moodIndex}`} value={this.state.emotions[moodIndex].percentage} onChange={this.handleInputRangeChange.bind(this, moodIndex, mood.moodId)} min="0" max="100" /> : null}

                </div>
                {this.state.emotions.length > 1 ? <i className={`fas fa-trash-alt ${classes.removeEmotion}`} onClick={this.handleRemoveEmotion.bind(this, moodIndex)} /> : null}
              </div>
            );
          })}
          {this.state.addNewEmotions ? <div className={classes.addEmotion}><i className="fas fa-plus-square" onClick={this.addNewEmotion}></i></div> : null}
          <textarea className={classes.journal} cols="30" rows="5" placeholder="Write how did your day go (optional)" value={this.state.journal} onChange={this.handleJournalChange}></textarea>
        </div>
        <div className={classes.buttonContainer}>
          <button type="submit" onClick={this.submitPixelData}>Submit</button>
        </div>
      </div>
    )
  }
  handleRemoveEmotion(moodIndex) {
    let oldEmotions = this.state.emotions;
    let newEmotions = [];
    // loop through old emotions, and push all except the one removed
    for (let i = 0; i < oldEmotions.length; i++) {
      if (i !== moodIndex) {
        newEmotions.push(oldEmotions[i]);
      }
    }
    // update percentages
    let newPercentages = 100 / newEmotions.length;
    for (let i = 0; i < newEmotions.length; i++) {
      newEmotions[i].percentage = newPercentages;
    }
    this.setState({
      emotions: newEmotions
    });
    const { userMoods } = this.props;
    if (newEmotions.length !== userMoods.length) {
      this.setState({
        addNewEmotions: true
      });
    }
  }
  handleSelectChange(moodIndex) {
    let emotions = this.state.emotions;
    let newEmotionVal = document.getElementById(`emotions-select-${moodIndex}`).value;
    let change = true;
    // loop through emotions to check if it's already selected
    for (let i = 0; i < emotions.length; i++) {
      if (newEmotionVal === emotions[i].moodId && i !== moodIndex) {
        change = false;
      }
    }
    if (change) {
      emotions[moodIndex].moodId = newEmotionVal;
      this.setState({
        emotions: emotions
      });
    }
  }
  handleInputRangeChange(moodIndex, moodId) {
    let length = this.state.emotions.length;
    // if there is only one slider, keep the percentage equal to 100
    if (length > 1) {
      let slider = document.getElementById(`emotions-range-${moodIndex}`);
      let value;
      value = slider.value;
      let input = +value;
      let delta = 100 - input;
      let sum = 0;
      let siblings = [];
      // for every range input
      for (let i = 0; i < this.state.emotions.length; i++) {
        // reset values for other ranges relatively
        let daymood = this.state.emotions[i];
        if (daymood.moodId !== moodId) {
          siblings.push(daymood);
          sum += +daymood.percentage;
        }
      }

      let partial = 0;
      let moods = this.state.emotions;
      moods[moodIndex].percentage = +value;
      siblings.forEach((sibling, i) => {
        let val = +sibling.percentage;
        let fraction = 0;

        //calculate fraction 
        if (sum <= 0) {
          fraction = 1 / (length - 1);
        } else {
          fraction = val / sum;
        }
        // The last element will correct rounding errors
        if (i >= length) {
          val = 100 - partial;
        } else {
          val = delta * fraction;
          partial += val;
        }

        for (let j = 0; j < moods.length; j++) {
          if (sibling.moodId === moods[j].moodId) {
            moods[j].percentage = +val;
          }
        }
      });
      this.setState({
        emotions: moods
      });
    }
  }
  handleJournalChange(event) {
    this.setState({ journal: event.target.value });
  }
  addNewEmotion() {
    // this will contain not set usermood
    let moodId = undefined;
    const { userMoods } = this.props;
    // loop through every user mood
    for (let i = 0; i < userMoods.length; i++) {
      let userMoodId = userMoods[i].moodID;
      if (moodId === undefined) {
        // loop through already set emotions
        for (let j = 0; j < this.state.emotions.length; j++) {
          let takenMoodID = this.state.emotions[j].moodId;
          if (takenMoodID === userMoodId) {
            // if both id are equal, just break the loop
            // cause that usermood is already taken
            break;
          } else if (j === this.state.emotions.length - 1) {
            // if there still weren't any taken id with such user id
            // and its the last one from the emotions
            // it's not taken
            moodId = userMoodId;
            if (i === userMoods.length - 1) {
              this.setState({
                addNewEmotions: false
              });
            }
          }
        }
      } else {
        break;
      }
    }
    let percentage = 100 / (this.state.emotions.length + 1);
    // update every selected mood percentages
    let newDayMoods = [];
    for (let i = 0; i < this.state.emotions.length; i++) {
      let oldDayMood = this.state.emotions[i];
      newDayMoods.push({ moodId: oldDayMood.moodId, percentage: percentage });
    }
    // add the real new mood
    newDayMoods.push({ moodId: moodId, percentage: percentage });
    this.setState({
      emotions: newDayMoods
    });
  }
  componentWillReceiveProps(nextProps) {
    let date = nextProps.date ? new Date(nextProps.date) : new Date();
    this.setState({
      date: date.setHours(0, 0, 0, 0),
      dateInputValue: this.formatDate(`#YYYY#-#MM#-#DD#`, date),
      addNewEmotions: true,
      journal: "",
      emotions: [
        { moodId: nextProps.userMoods[0].moodID, percentage: 100 }
      ],
    })
  }
  formatDate(formatString, date) {
    var YYYY, MM, DD, hhhh, mm;
    YYYY = date.getFullYear()
    MM = date.getMonth() + 1 < 10 ? (`0` + (date.getMonth() + 1)) : date.getMonth() + 1;
    DD = date.getDate() < 10 ? (`0` + date.getDate()) : date.getDate();
    formatString = formatString.replace("#YYYY#", YYYY).replace("#MM#", MM).replace("#DD#", DD);
    hhhh = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
    mm = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
    return formatString.replace("#hhhh#", hhhh).replace("#mm#", mm);
  };
  submitPixelData() {
    if (this.state.emotions[0].moodId !== undefined) {
      let data = {
        date: this.state.date.toString(),
        dayMoods: this.state.emotions,
        journal: this.state.journal
      };
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', `https://api.yearsinpixels.com/api/mood`, true);
        httpRequest.setRequestHeader("x-access-token", `${token}`);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(JSON.stringify(data));
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
                this.props.refreshPixelMoods();
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
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.props.messages.push({ text: e, type: "error" });
            this.props.renderMessages();
          }
        }
      }
    }
  }
  componentDidUpdate() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(NewPixel);