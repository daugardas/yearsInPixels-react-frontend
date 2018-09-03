import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'flex',
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#4b5b66',
    fontSize: 25,
    '& i': {
      marginRight: 40
    },
    '&:hover': {
      cursor: 'pointer'
    }
  }
};

class NavBars extends Component {
  render() {
    const { classes, onClick, clicked, width } = this.props;
    const button = (
      <div className={classes.container}>
        {clicked ? <i className={`fas fa-times`} onClick={onClick}></i> : <i className={`fas fa-bars`} onClick={onClick}></i>}
      </div>
    );
    const element = width < 1024 ? button : null;
    return element
  }
}

export default injectSheet(styles)(NavBars);