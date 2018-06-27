import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: `grid`,
    gridAutoRows: `30px`
  },
  day: {
    fontSize: `24px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    width: `100%`,
    height: `100%`
  }
};

class DayNumbers extends Component {
  render() {
    const { classes } = this.props;
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(<div className={classes.day} key={i} >{i}</div>);
    }
    return (
      <div className={classes.container}>
        <span></span>
        {days}
      </div>
    );
  }
}

export default injectSheet(styles)(DayNumbers);