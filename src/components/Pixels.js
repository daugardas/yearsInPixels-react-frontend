import React, { Component } from 'react';
import injectSheet from 'react-jss';

import DayNumbers from './Pixels/DayNumbers';
import SelectedPixel from './Pixels/SelectedPixel';
import Month from './Pixels/Month';

import { connect } from 'react-redux';

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

  render() {
    const { classes, user, pixels, selected } = this.props;
    const year = new Date().getFullYear();
    let months = new Array(12);
    for (let i = 0; i < 12; i++) {
      let moods = [];
      for (let j = 0; j < pixels.length; j++) {
        const mood = pixels[j];
        const moodDate = new Date(+mood.date);
        if (moodDate.getMonth() === i) {
          moods.push(mood)
        }

      }
      months[i] = moods;
    }

    return (
      <div className={classes.container}>

        <div className={classes.grid}>
          <DayNumbers />
          {
            months.map((month, index) => {
              if (month.length > 0) {
                return <Month date={new Date(year, index, 1).getTime()} key={index} moods={user.moods} pixels={month} selected={selected} />
              } else {
                return <Month date={new Date(year, index, 1).getTime()} key={index} moods={user.moods} selected={selected} />
              }
            })
          }
        </div>

        <div className={classes.description}>
          <SelectedPixel moods={user.moods} />
        </div>
      </div>
    );

  }
}

function mapStateToProps(state) {
  return { user: state.user, pixels: state.pixelMoods, selected: { changed: state.selectedPixel.changed, id: state.selectedPixel.id, date: state.selectedPixel.date, moods: state.selectedPixel.moods } }
}

export default connect(mapStateToProps)(injectSheet(styles)(Pixels));