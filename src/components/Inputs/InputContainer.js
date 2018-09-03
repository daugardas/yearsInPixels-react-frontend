import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { connect } from 'react-redux';

const styles = {
  default: {
    '& span': {
      color: '#364d6b'
    },
    '& > div': { // selects input containers
      display: 'flex'
    },
    '& > div > input': { // selects all inputs
      flex: 'auto',
      fontFamily: 'Indie Flower, cursive',
      // float: 'right',
      padding: '5px 10px 5px 15px',
      caretColor: '#a1d2ff',
      '&:invalid, &:invalid + div': {
        borderColor: '#ff6060'
      },
      '&:focus, &:focus + div': {
        borderColor: '#a9dbff'
      }
    },
    '& > div > *': { // selects all inputs, and password hide/show button container
      borderRadius: 25,
      background: 'white',
      // background: '#f3fbff',
      transition: 'border-color 0.5s ease',
    }
  },
  desktop: {
    width: 540,
    margin: [[12, 0]],
    '& span': {
      fontSize: 35,
    },  
    '& > div > input': { // selects all inputs
      marginLeft: 20,
      lineHeight: '35px',
      fontSize: 22,
    },
    '& > div > *': { // selects all inputs, and password hide/show button container
      border: [3, 'solid', '#d8efff'],
    }
  },
  mobile: {
    width: '100%',
    margin: [[5, 0]],
    '& span': {
      display: 'block',
      fontSize: 28,
      margin: [[0, 0, 5, 0]]
    },
    '& > div > input': { // selects all inputs
      margin: 0,
      lineHeight: '32px',
      fontSize: 22,
    },
    '& > div > *': { // selects all inputs, and password hide/show button container
      border: [2, 'solid', '#d8efff'],
    }
  },
  '@media (min-width: 650px)': {
    mobile: {
      '& span': {
        fontSize: 35,
      },
      '& > div > input': { // selects all inputs
        // marginLeft: 20,
        lineHeight: '35px',
        fontSize: 22,
      },
    }
  }
};

class InputContainer extends Component {
  render() {
    const { classes, children, label, width, windowWidth } = this.props;
    return (
      <div className={`${classes.default} ${windowWidth >= 960 ? classes.desktop : classes.mobile}`} style={width && windowWidth >= 960 ? { width: `${isNaN(width) ? width : `${width}px`}` } : {}}>
        {label && <span>{label}</span>}
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { windowWidth } = state;
  return { windowWidth };
}

export default connect(mapStateToProps)(injectSheet(styles)(InputContainer));