import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import injectSheet from 'react-jss';

import Loader from './Loader';
import TextInput from './Inputs/TextInput';
import PasswordInput from './Inputs/PasswordInput';
import EmailInput from './Inputs/EmailInput';
import SubmitButton from './SubmitButton';

import { register } from '../actions/RegisterActions';
import store from '../stores';
import { createNotification } from '../actions/notificationsActions'
const styles = {
  container: {
    display: `block`,
    margin: `auto`,
    position: `absolute`,
    width: `auto`,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    height: `auto`,
    '& form': {
      display: `flex`,
      flexDirection: `column`
    }
  },
  inputContainer: {
    width: `auto`,
    margin: `12px 0`,
    '& label': {
      fontSize: `35px`,
      color: `#364d6b`
    }
  },
  recaptcha: {
    alignSelf: 'center'
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    this.recaptchaVerify = this.recaptchaVerify.bind(this);
    this.state = {
      captchaVerified: false,
      captchaToken: null,
      email: '',
      username: '',
      password: '',
      confPassword: ''
    };
  }
  render() {
    const { classes } = this.props;
    const { username, email, password, confPassword } = this.state;
    const form = this.state.loading ? (
      <Loader />
    ) : (
        <form method="post">
          <div className={classes.inputContainer}>
            <label htmlFor="username">Username:</label>
            <TextInput required onChange={this.handleUsernameChange.bind(this)} value={username} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="email">Email:</label>
            <EmailInput required onChange={this.handleEmailChange.bind(this)} value={email} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="password">Password:</label>
            <PasswordInput required value={password} onChange={this.handlePassChange.bind(this)} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="conf-password">Confirm password:</label>
            <PasswordInput required value={confPassword} onChange={this.handleConfPassChange.bind(this)} />
          </div>
          <Recaptcha
            className={classes.recaptcha}
            sitekey="6Lf1HFwUAAAAAAEIUqAnwrGrXJtqqL_ya6tPV7bS"
            verifyCallback={this.recaptchaVerify}
          />
          <SubmitButton onClick={this.register}>Register</SubmitButton>
        </form>
      );
    return (
      <div className={classes.container}>
        {form}
      </div>
    );
  }
  handleUsernameChange(val) {
    this.setState({ username: val });
  }
  handleEmailChange(val) {
    this.setState({ email: val });
  }
  handlePassChange(val) {
    this.setState({ password: val });
  }
  handleConfPassChange(val) {
    this.setState({ confPassword: val });
  }
  recaptchaVerify(response) {
    this.setState({ captchaVerified: true, captchaToken: response });
  }
  register() {
    const { captchaVerified } = this.state;
    if (captchaVerified) {
      const { email, username, password, confPassword, captchaToken } = this.state;
      register(email, username, password, confPassword, captchaToken);
    } else {
      store.dispatch(createNotification('error', "Verify that you're not a robot."));
    }
  }

}

export default injectSheet(styles)(Register);