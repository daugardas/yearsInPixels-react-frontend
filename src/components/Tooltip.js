import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    position: 'relative',
    '& .visible': {
      visibility: 'hidden'
    },
    '&:hover .visible': {
      visibility: 'visible'
    }
  },
  text: {
    position: 'absolute',
    width: 'max-content',
    top: '-120%',
    transform: 'translateX(-50%)',
    fontSize: 25,
    fontWeight: 'bold'
  }
};

class Tooltip extends Component {
  render() {
    const { classes, tip, children, hide } = this.props;
    return (
      <div className={classes.container}>
        {children}
        {
          !hide ? <span className={`visible ${classes.text}`}>{tip}</span> : null
        }
      </div>
    );
  }
}

export default injectSheet(styles)(Tooltip);