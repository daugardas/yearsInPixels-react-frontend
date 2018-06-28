import React, { Component } from 'react';
import injectSheet from 'react-jss';

import AddMood from './AddMood';
import Mood from './Mood';

const styles = {
  container: {
    display: `flex`,
    flexDirection: `column`
  },
  headerContainer: {
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    borderBottom: `#364d6b 1px solid`,
    '& span': {
      fontSize: `35px`,
      color: `#364d6b`
    }
  },
  moodsList: {
    display: `flex`,
    flexDirection: `column`
  }
};

class AppSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moods: undefined
    }
    this.getMoods = this.getMoods.bind(this);
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.headerContainer}><span>Pixels</span></div>
        <div className={classes.moodsList} id="moods">
          {this.state.moods}
          <AddMood getMoods={this.getMoods} messages={this.props.messages}
            renderMessages={this.props.renderMessages} />
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.getMoods();
  }
  getMoods() {
    // eslint-disable-next-line
    const { createNotification } = this.props;
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
              let moods = response.moods.map(mood => (
                <Mood mood={mood} key={mood.moodID} removeNotifications={this.removeNotifications} createNotification={this.createNotification} />
              ));
              this.setState({
                moods: moods
              });
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => createNotification('error', err));
              } else {
                createNotification('error', response.error)
              }
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
        }
      }
    }
  }
}

export default injectSheet(styles)(AppSettings);