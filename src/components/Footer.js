import React, { Component } from 'react';
import injectSheet from 'react-jss';

import githubLogo from './../GitHub-Mark-120px-plus.png';

const styles = {
  footer: {
    display: `flex`,
    position: `fixed`,
    right: `10px`,
    bottom: `5px`,
    alignItems: `center`,
    justifyContent: `center`,
    '& p': {
      fontSize: `20px`,
      lineHeight: `29px`,
      display: `inherit`,
      alignItems: `center`,
      justifyContent: `center`
    },
    '& img': {
      width: `25px`,
      marginLeft: `5px`
    }
  }
};
class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.footer}>
        <p>Made by Daugardas Lukšas -</p>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/daugardas"><img alt="GitHub icon" src={githubLogo} /></a>
      </div>
    );
  }
}

export default injectSheet(styles)(Footer);