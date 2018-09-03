import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontSize: 35,
    color: '#364d6b'
  },
  journal: {
    fontSize: 20,
    background: '#ffffff',
    padding: 20,
    border: [3, 'solid', '#dbf0fd'],
    borderRadius: 25,
    whiteSpace: 'pre-wrap',
    fontFamily: "'Kalam', cursive",
    fontWeight: 300,
    color: '#6b6b6b',
    textOverflow: 'clip',
    hyphens: 'auto'
  }
};

class Journal extends Component {
  render() {
    const { classes, journal } = this.props;
    return journal !== "" ? (
      <div>
        <span className={classes.header}>Diary entry</span>
        <div className={classes.journal}>{journal}</div>
      </div>
    ) : null
  }
}

export default injectSheet(styles)(Journal);