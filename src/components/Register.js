import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import injectSheet from 'react-jss';

import Loader from './Loader';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
import EmailInput from './EmailInput';
import SubmitButton from './SubmitButton';

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
      loading: false,
      captchaVerified: false,
      captchaToken: null,
      email: '',
      username: '',
      password: '',
      confPassword: ''
    };
  }
  render(){
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
  handleUsernameChange(val){
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
    const { createNotification } = this.props;
    const { email, username, password, confPassword, captchaToken, captchaVerified } = this.state;
    if (captchaVerified) {
      this.setState({ loading: true });
      let makeRequest = true;

      // validate email and passwords
      if (password !== confPassword) {
        makeRequest = false;
        createNotification('error', "Passwords do not match.");
      }

      if (password.length < 8) {
        makeRequest = false;
        createNotification('error', "Minimum password length is 8 characters.");
      } else if (password.length > 128) {
        makeRequest = false;
        createNotification('error', "Maximum password length is 128 characters.");
      } else {
        let passwordRegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/g;
        if (!passwordRegExp.test(password)) {
          makeRequest = false;
          createNotification('error', "Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter.");
        }
      }

      // check email
      let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegEx.test(email)) {
        makeRequest = false;
        createNotification('error', "Email adress is invalid.");
      }

      // check username
      if (username.length < 5) {
        createNotification('error', "Username must be higher than 5 characters.");
        makeRequest = false;
      } else if (username.length > 35) {
        makeRequest = false;
        createNotification('error', "Username must be lower than 32 characters.");
      }

      if (makeRequest) {
        let data = {
          'username': username,
          'email': email,
          'password': password,
          'recaptchaResponse': captchaToken
        }

        let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', `https://api.yearsinpixels.com/api/register`, true);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(data));
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 201) {
                createNotification('success', "Succesfully registered, now you can login!");
              } else if (httpRequest.status === 429) {
                let response = JSON.parse(httpRequest.responseText);
                createNotification('error', response.error);
              } else {
                let response = JSON.parse(httpRequest.responseText);

                if (response.hasOwnProperty('errors')) {
                  response.errors.map(err => console.log(err));
                } else if (response.hasOwnProperty('error')) {
                  console.log(response.error);
                } else {
                  console.log(response.message);
                }
              }

              this.setState({ loading: false });
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.setState({ loading: false });
          }
        }
      } else {
        this.setState({ loading: false });
      }
    } else {
      createNotification('error', "Verify that you're not a robot.");
      this.setState({ loading: false });
    }
  }
  componentDidMount() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(Register);