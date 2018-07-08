import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import injectSheet from 'react-jss';

import Loader from './Loader';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
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
      display: 'flex',
      flexDirection: 'column'
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
  iconContainer: {
    display: `flex`,
    float: `right`,
    width: `40px`,
    height: `45.5px`,
    background: `#f3fbff`,
    alignItems: `center`,
    justifyContent: `center`,
    border: `1px solid #d8efff`,
    borderRadius: `25px`,
    borderTopLeftRadius: `0`,
    borderBottomLeftRadius: `0`,
    '& i': {
      cursor: `pointer`,
      margin: `0 10px`,
      color: `#83a2c7`,
      transition: `color 0.2s ease`,
    },
    '& i:hover': {
      color: `#00060e`
    }
  },
  forgot: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: `10px`,
    '& a': {
      fontSize: `20px`,
      textDecoration: `none`
    }
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: '',
      password: ''
    };
    this.login = this.login.bind(this);
  }
  render() {
    const { classes } = this.props;
    const { username, password } = this.state;
    const form = this.state.loading ? <Loader /> : (
      <form method="post">
        <div className={classes.inputContainer}>
          <label htmlFor="username">Username:</label>
          <TextInput onChange={this.handleUsernameChange.bind(this)} value={username} />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="password">Password:</label>
          <PasswordInput value={password} onChange={this.handlePasswordChange.bind(this)}/>
        </div>
        <SubmitButton onClick={this.login}>Login</SubmitButton>
        <div className={classes.forgot}><NavLink to="/forgot">Forgot your password?</NavLink></div>
      </form>
    );
    return (
      <div className={classes.container}>
        {form}
      </div>
    );
  }
  handleUsernameChange(val){
    this.setState({ username: val});
  }
  handlePasswordChange(val){
    this.setState({ password: val});
  }
  login() {
    this.setState({ loading: true });
    const { createNotification } = this.props;
    const { username, password } = this.state;
    
    let user = {
      username: username,
      password: password,
    }

    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', `https://api.yearsinpixels.com/api/login`, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(JSON.stringify(user));
    httpRequest.onreadystatechange = () => {
      try {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            let response = JSON.parse(httpRequest.responseText);

            document.cookie = `token=${response.token}`;
            document.cookie = `username=${response.data.username}`;
            document.cookie = `userID=${response.data.id}`;
            document.cookie = `userCreated=${response.data.dateCreated}`;
            document.cookie = `userEmail=${response.data.email}`;

            this.setState({ loading: false });
            this.props.login();
          } else {
            let response = JSON.parse(httpRequest.responseText);

            if (response.hasOwnProperty('errors')) {
              response.errors.map(err => createNotification('error', response.errors));
            } else if (response.hasOwnProperty('error')) {
              createNotification('error', response.error)
            } else {
              createNotification('error', response.message)
            }
            
            this.setState({ loading: false });
          }
        }
      } catch (e) {
        console.error(`Caught error: `, e);
      }
    }
  }
  componentDidMount() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(Login);