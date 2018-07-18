import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    width: 'auto',
    margin: '12px 0',
    '& label': {
      fontSize: 35,
      color: '#364d6b'
    }
  }
};

class InputContainer extends Component {
  render() {
    const { classes, children, label } = this.props;
    return (
      <div className={classes.container}>
        {label && <label>{label}</label>}
        {children}
      </div>
    );
  }
}

export default injectSheet(styles)(InputContainer);