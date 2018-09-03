import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  }
};

class ButtonsContainer extends Component {
  render(){
    const { classes, children } = this.props;
    return <div className={classes.container}>{children}</div>
  }
}

export default injectSheet(styles)(ButtonsContainer);