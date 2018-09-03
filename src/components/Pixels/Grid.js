import React, { Component } from 'react';
import injectSheet from 'react-jss';

import GridLines from './GridBackground';
import Month from './Month';

const styles = {
  default: {
    display: 'grid',
    gridTemplateColumns: 'repeat(13, 30px)',
    fontSize: 20
  },
  desktop: {
    marginLeft: 150
  },
  mobileContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    margin: [0, 0, 60, 0]
  },
  mobile: {
    width: '100vw',
    height: 864,
    position: 'absolute',
    top: 45,
    background: '#ffffff',
    zIndex: -2
  },
  numbers: {
    display: 'grid',
    gridAutoRows: '30px',
  },
  number: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  '@media (max-width: 420px) and (min-width: 360px)': {
    default: {
      gridTemplateColumns: 'repeat(13, 27px)',
      fontSize: 18
    },
    numbers: {
      gridAutoRows: '27px'
    }
  },
  '@media (max-width: 360px)': {
    default: {
      gridTemplateColumns: 'repeat(13, 26px)',
    },
    numbers: {
      gridAutoRows: '26px'
    }
  }
}

class Grid extends Component {
  render() {
    const { classes, width, mode, year, moods, pixels, selected } = this.props;
    let numbers = [];
    for (let i = 1; i <= 31; i++) {
      numbers.push(<div className={classes.number} key={i}>{i}</div>);
    }

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

    return mode ? (
      <div className={classes.mobileContainer}>
        <div className={classes.default}>
          <GridLines size={width > 420 ? 30 : width > 360 ? 27 : 26} />
          <div className={classes.numbers}>
            <div></div> {/* empty element, this is not a mistake */}
            {numbers}
          </div>
          {
            months.map((month, index) => {
              if (month.length > 0) {
                return <Month date={new Date(year, index, 1).getTime()} key={index} moods={moods} pixels={month} selected={selected} mode={mode}/>
              } else {
                return <Month date={new Date(year, index, 1).getTime()} key={index} moods={moods} selected={selected} mode={mode}/>
              }
            })
          }
        </div>
        <div className={classes.mobile}></div>
      </div>

    ) : (
        <div className={`${classes.default} ${classes.desktop}`}>
          <div className={classes.numbers}>
            <div></div> {/* empty element, this is not a mistake */}
            {numbers}
          </div>
          {
            months.map((month, index) => {
              if (month.length > 0) {
                return <Month date={new Date(year, index, 1).getTime()} key={index} moods={moods} pixels={month} selected={selected} mode={mode} />
              } else {
                return <Month date={new Date(year, index, 1).getTime()} key={index} moods={moods} selected={selected} mode={mode} />
              }
            })
          }
        </div>
      );
  }
}

export default injectSheet(styles)(Grid);