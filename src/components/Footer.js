import React, { Component } from 'react';
import injectSheet from 'react-jss';

import githubLogo from './../GitHub-Mark-120px-plus.png';

const styles = {
  default: {
    '& p': {
      fontSize: 20,
      lineHeight: '29px',
      display: 'inherit',
      alignItems: 'center',
      justifyContent: 'center'
    },
    '& img': {
      width: 25,
      marginLeft: 5
    }
  },
  fixed: {
    position: 'fixed',
    right: 10,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  madeBy: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div id='footer' className={`${classes.default} ${classes.fixed}`}>
        <div className={classes.madeBy}>
          <p>Made by Daugardas Lukšas -</p>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/daugardas"><img alt="GitHub icon" src={githubLogo} /></a>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(Footer);