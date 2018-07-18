import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'flex',
    width: 600,
    alignItems: `center`,
    justifyContent: `center`,
    flexDirection: `column`,
    margin: {
      top: 0,
      right: `auto`,
      bottom: 0,
      left: `auto`
    },
    padding: 30
  },
  header: {
    fontSize: 50,
    color: `#4b5b66`
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 20,
    color: `#4b5b66`,
    lineHeight: `35px`,
    fontFamily: `Indie Flower, cursive !important`,
    '& a': {
      fontFamily: `Indie Flower, cursive !important`
    }
  },
  '@media (max-width: 1024px)':{
    container: {
      width: 600
    }
  },
  '@media (max-width: 756px)':{
    container: {
      width: 500
    }
  },
  '@media (max-width: 512px)': {
    container: {
      width: 400
    }
  },
  '@media (max-width: 450px)': {
    container: {
      width: 300
    }
  },
  '@media (max-width: 400px)': {
    container: {
      width: 250
    }
  }
}

class About extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <h1 className={classes.header}>A Year In Pixels</h1>
        <h1>The ultimate mood tracker</h1>
        <p className={classes.paragraph}>
          This tool can be used to track your moods throughout years, you can discover certain paterns too.
        </p>
        <br/>
        <p className={classes.paragraph}>
          The Year in Pixels chart was created by Camille or <span> </span>
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/passioncarnets/">@passioncarnets</a>.
        </p>
      </div>
    );
  }
}

export default injectSheet(styles)(About)