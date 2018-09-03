import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import injectSheet from 'react-jss';

import Form from './FormContainer';
import InputContainer from './Inputs/InputContainer';
import TextInput from './Inputs/TextInput';
import PasswordInput from './Inputs/PasswordInput';
import SubmitButton from './SubmitButton';

import { login } from '../actions/LoginActions';

const styles = {
  forgot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    '& a': {
      fontSize: 20,
      textDecoration: 'none'
    }
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.login = this.login.bind(this);
  }
  render() {
    const { classes } = this.props;
    const { username, password } = this.state;

    return (
      <Form>
        <InputContainer label="Username:" >
          <TextInput required onChange={this.handleUsernameChange.bind(this)} value={username} />
        </InputContainer>

        <InputContainer label="Password:" >
          <PasswordInput required value={password} onChange={this.handlePasswordChange.bind(this)} />
        </InputContainer>

        <SubmitButton onClick={this.login}>Login</SubmitButton>
        <div className={classes.forgot}><NavLink to="/forgot">Forgot your password?</NavLink></div>
      </Form>
    );
  }
  handleUsernameChange(val) {
    this.setState({ username: val });
  }
  handlePasswordChange(val) {
    this.setState({ password: val });
  }
  login() {
    const { username, password } = this.state;
    login({ username, password });
  }
}

export default injectSheet(styles)(Login);