import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import injectSheet from 'react-jss';

const styles = {
  container: {
    display: `block`,
    margin: `auto`,
    position: `absolute`,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    width: `auto`,
    height: `auto`
  },
  label: {
    fontSize: `30px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: `9px`
  },
  buttonContainer: {
    display: `flex`,
    width: `100%`,
    marginTop: `30px`,
    alignItems: `center`,
    justifyContent: `center`
  },
  confirm: {
    // both buttons apply these
    padding: `10px`,
    width: `130px`,
    fontSize: `25px`,
    margin: `0 10px`,
    border: `5px solid #e8f4fc`,
    borderRadius: `30px`,
    transition: `font-weight 0.5s ease, transform 0.3s ease, color 0.3s ease`,
    color: `#427e42`, // specific confirm color
    '&:hover': {
      fontWeight: `900`,
      cursor: `pointer`,
      transform: `scale(1.05)`,
      color: `#009100` // specific confirm color
    }
  },
  cancel: {
    // both buttons apply these
    padding: `10px`,
    width: `130px`,
    fontSize: `25px`,
    margin: `0 10px`,
    border: `5px solid #e8f4fc`,
    borderRadius: `30px`,
    transition: `font-weight 0.5s ease, transform 0.3s ease, color 0.3s ease`,
    color: `#925858`, // specific cancel button
    '&:hover': {
      fontWeight: `900`,
      cursor: `pointer`,
      transform: `scale(1.05)`,
      color: `#a50000` // specific cancel button
    }
  }
};

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
    this.handleRedirect = this.handleRedirect.bind(this);
  }
  redirect() {
    if (this.state.redirect) {
      return <Redirect to='/yearly' />
    }
  }
  handleRedirect() {
    this.setState({ redirect: true });
  }
  render() {
    const { classes } = this.props;
    return (
      <div id="logout-wrapper" className={classes.container}>
        <div className={classes.label}>Are you sure you want to log out?</div>
        <div className={classes.buttonContainer}>
          {this.redirect()}
          <button type="button" onClick={this.props.logOut} className={classes.confirm}>Log out</button>
          <button type="button" onClick={this.handleRedirect} className={classes.cancel}>Cancel</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(Logout);