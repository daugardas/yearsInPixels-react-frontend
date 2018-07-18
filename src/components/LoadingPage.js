import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

class LoadingPage extends Component {
  render() {
    const { classes } = this.props;
    return <div className={classes.container}>Loading...</div>
  }
}

export default injectSheet(styles)(LoadingPage);