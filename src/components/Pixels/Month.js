import React, { Component } from 'react';
import injectSheet from 'react-jss';

import Day from './Day';

const styles = {
  container: {
    display: `grid`,
    width: `100%`,
    gridAutoRows: `30px`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  name: {
    fontSize: `20px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`
  }
};

class Month extends Component {
  render() {
    const monthDate = new Date(this.props.date);
    const { classes, pixels, moods, selected } = this.props;

    const monthDaysCount = new Date(new Date(monthDate).setFullYear(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)).getDate();
    let monthDays = new Array(monthDaysCount);

    for (let i = 1; i <= monthDaysCount; i++) { // for every day in a month
      const dayDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), i).getTime();
      let mood;
      if (pixels !== undefined) { // if there exists moods with a correct month to that mood
        for (let j = 0; j < pixels.length; j++) { // loop through those moods
          if (+pixels[j].date === +dayDate) { // check if mood date equal a day date
            mood = pixels[j];
          }
        }
      }
      monthDays[i - 1] = { mood, date: dayDate }
    }

    return (
      <div className={classes.container}>
        <div className={classes.name}>{monthDate.toDateString().split(' ')[1]}</div>
        {
          monthDays.map((day, index) => {
            return <Day key={index} date={day.date} moods={moods} pixel={day.mood} selected={selected} />
          })
        }
      </div>
    );
  }
}

export default injectSheet(styles)(Month);