import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    flexDirection: `column`,
    width: `100%`,
    '& span': {
      fontSize: `35px`,
      color: `#364d6b`
    }
  },
  journal: {
    fontSize: `20px`,
    background: `#ffffff`,
    padding: `20px`,
    border: `3px solid #dbf0fd`,
    borderRadius: `25px`,
    whiteSpace: `pre-wrap`,
    fontFamily: `'Kalam', cursive`,
    fontWeight: `300`,
    color: `#6b6b6b`,
    width: `400px`,
    textOverflow: `clip`,
    hyphens: `auto`
  }
};

class Journal extends Component {
  render() {
    const { classes, journal } = this.props;
    return journal !== "" ? (
      <div className={classes.container}>
        <span>Diary entry</span>
        <div className={classes.journal}>{journal}</div>
      </div>
    ) : null

  }
}

export default injectSheet(styles)(Journal);