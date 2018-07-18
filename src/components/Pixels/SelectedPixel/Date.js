import React, { Component } from 'react';
import injectSheet from 'react-jss';

import formatDate from '../../../functions/formatDate';

const styles = {
  date: {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    fontSize: `30px`,
    position: `relative`
  }
};

class PixelDate extends Component {
  render(){
    const { classes, date } = this.props;
    return <div className={classes.date}>Date: {formatDate(`#YYYY#-#MM#-#DD#`, new Date(date))}</div>
  }
}

export default injectSheet(styles)(PixelDate);