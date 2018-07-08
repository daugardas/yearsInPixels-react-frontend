import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  submitButton: {
    padding: 10,
    width: 130,
    backgroundColor: '#eef9ff',
    fontSize: 25,
    margin: '0 10px',
    border: '5px solid #dbf0ff',
    borderRadius: 30,
    transition: 'font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease',
    alignSelf: 'center',
    '&:hover': {
      fontWeight: '700',
      cursor: 'pointer',
      transform: 'scale(1.02)'
    }
  }
}

class SubmitButton extends Component {
  render() {
    const { classes, children } = this.props;
    return <button type="submit" onClick={this.handleClick.bind(this)} className={classes.submitButton}>{children}</button>
  }
  handleClick(e) {
    e.preventDefault();
    const { onClick } = this.props;
    onClick();
  }
}

export default injectSheet(styles)(SubmitButton);