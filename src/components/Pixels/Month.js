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
  constructor(props) {
    super(props);
    this.state = {
      monthDate: new Date(this.props.date)
    };
  }
  render() {
    const { monthDate } = this.state;
    let monthDaysCount = new Date(new Date(monthDate).setFullYear(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)).getDate();
    let monthDays = new Array(monthDaysCount);
    const { pixelMoods, classes } = this.props;
    for (let i = 1; i <= monthDaysCount; i++) { // for every day in a month
      let dayDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), i).getTime();
      let mood;
      if (pixelMoods !== undefined) { // if there exists moods with a correct month to that mood
        for (let j = 0; j < pixelMoods.length; j++) { // loop through those moods
          if (+pixelMoods[j].date === +dayDate) { // check if mood date equal a day date
            mood = pixelMoods[j];
          }
        }
      }
      monthDays[i - 1] = { mood: mood, dayDate: dayDate }
    }
    return (
      <div className={classes.container}>
        <div className={classes.name}>{monthDate.toDateString().split(' ')[1]}</div>
        {
          monthDays.map((day, index) => {
            return <Day editPixel={this.props.editPixel} key={index} date={day.dayDate} userMoods={this.props.userMoods} pixelMoods={day.mood} />
          })
        }
      </div>
    );
  }
}

export default injectSheet(styles)(Month);