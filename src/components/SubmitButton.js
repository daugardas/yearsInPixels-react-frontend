import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  button: {
    padding: [[10, 20]],
    minWidth: 130,
    fontSize: 25,
    margin: '0 10px',
    background: 'white',
    border: [5, 'solid', '#dbf0ff'],
    borderRadius: 30,
    transition: 'font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease',
    alignSelf: 'center',
    fontWeight: 'bold',
    '&:hover': {
      cursor: 'pointer',
      transform: 'scale(1.02)'
    }
  },
  default: {
    // background: '#eef9ff',
    // borderColor: ' #dbf0ff',
    color: '#427e42'
  },
  warning: {
    // background: '#ffb3b3',
    // borderColor: ' #ff8e8e',
    color: '#925858'
  },
  '@media (max-width: 650px)': {
    button: {
      marginTop: 10,
      fontSize: 22,
      padding: [[5, 10]],
      borderWidth: 3
    }
  }
}

class SubmitButton extends Component {
  render() {
    const { classes, children, warning } = this.props;
    return <button type="button" onClick={this.handleClick.bind(this)} className={`${classes.button} ${warning ? classes.warning : classes.default}`}>{children}</button>
  }
  handleClick(e) {
    e.preventDefault();
    const { onClick } = this.props;
    onClick();
  }
}

export default injectSheet(styles)(SubmitButton);