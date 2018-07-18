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
  render() {
    const { classes, moods } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <span>Pixels</span>
        </div>
        <div className={classes.moodsList} id="moods">
          {moods.map((mood, i)=> <Mood mood={mood} key={mood.moodID} />)}
          <AddMood />
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(AppSettings);