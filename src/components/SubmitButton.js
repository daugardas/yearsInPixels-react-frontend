import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  button: {
    padding: '10px 20px',
    minWidth: 130,
    fontSize: 25,
    margin: '0 10px',
    borderRadius: 30,
    transition: 'font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease',
    alignSelf: 'center',
    '&:hover': {
      fontWeight: '700',
      cursor: 'pointer',
      transform: 'scale(1.02)'
    }
  },
  default: {
    background: '#eef9ff',
    border: '5px solid #dbf0ff',
  },
  warning: {
    background: '#ffb3b3',
    border: '5px solid #ff8e8e',
  }
}

class SubmitButton extends Component {
  render() {
    const { classes, children, warning } = this.props;
    return <button type="submit" onClick={this.handleClick.bind(this)} className={`${classes.button} ${warning ? classes.warning : classes.default}`}>{children}</button>
  }
  handleClick(e) {
    e.preventDefault();
    const { onClick } = this.props;
    onClick();
  }
}

export default injectSheet(styles)(SubmitButton);