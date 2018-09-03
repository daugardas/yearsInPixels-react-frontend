import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import injectSheet from 'react-jss';

import Form from './FormContainer';
import InputContainer from './Inputs/InputContainer';
import TextInput from './Inputs/TextInput';
import PasswordInput from './Inputs/PasswordInput';
import EmailInput from './Inputs/EmailInput';
import SubmitButton from './SubmitButton';

import { register } from '../actions/RegisterActions';
import store from '../stores';
import { createNotification } from '../actions/notificationsActions';

const styles = {
  recaptchaContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  '@media (max-width: 650px)': {
    recaptchaContainer: {
      width: 300,
      margin: [[10, 0, 5, 0]],
    }
  },
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

    return (
      <Form>
        <InputContainer label="Username:">
          <TextInput required onChange={this.handleUsernameChange.bind(this)} value={username} />
        </InputContainer>

        <InputContainer label="Email:">
          <EmailInput required onChange={this.handleEmailChange.bind(this)} value={email} />
        </InputContainer>

        <InputContainer label="Password:" >
          <PasswordInput required value={password} onChange={this.handlePassChange.bind(this)} />
        </InputContainer>

        <InputContainer label="Confirm password:">
          <PasswordInput required value={confPassword} onChange={this.handleConfPassChange.bind(this)} />
        </InputContainer>

        <div className={classes.recaptchaContainer}>
          <Recaptcha
            sitekey="6Lf1HFwUAAAAAAEIUqAnwrGrXJtqqL_ya6tPV7bS"
            verifyCallback={this.recaptchaVerify}
          />
        </div>

        <SubmitButton onClick={this.register}>Register</SubmitButton>
      </Form>
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