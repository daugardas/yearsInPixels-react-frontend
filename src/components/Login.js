import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import injectSheet from 'react-jss';

import Loader from './Loader';

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
  input: {
    fontFamily: `Indie Flower, cursive`,
    float: `right`,
    fontSize: `22px`,
    marginLeft: `20px`,
    background: `#f3fbff`,
    width: `290px`,
    borderRadius: `25px`,
    border: ` 1px solid #d8efff`,
    padding: ` 5px 10px 5px 15px`,
    lineHeight: `35px`,
    caretColor: `#a1d2ff`,
    transition: `box-shadow 0.5s ease`,
    '&:focus': {
      boxShadow: `0px 0px 0px 2px #a9dbff`
    }
  },
  inputPass: {
    fontFamily: `Indie Flower, cursive`,
    float: `right`,
    marginLeft: `20px`,
    background: `#f3fbff`,
    borderRadius: `25px`,
    border: ` 1px solid #d8efff`,
    padding: ` 5px 10px 5px 15px`,
    lineHeight: `35px`,
    borderTopRightRadius: `0`,
    borderBottomRightRadius: `0`,
    fontSize: `16px`,
    width: `249px`,
    caretColor: `#a1d2ff`,
    transition: `box-shadow 0.5s ease`,
    '&:focus': {
      boxShadow: `0px 0px 0px 2px #a9dbff`
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
  },
  button: {
    padding: `10px`,
    width: `130px`,
    backgroundColor: `#eef9ff`,
    fontSize: `25px`,
    margin: `0 10px`,
    border: `5px solid #dbf0ff`,
    borderRadius: `30px`,
    transition: `font - weight 0.3s ease, transform 0.3s ease, color 0.3s ease`,
    alignSelf: `center`,
    '&:hover': {
      fontWeight: `700`,
      cursor: `pointer`,
      transform: `scale(1.02)`
    }
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.login = this.login.bind(this);
  }
  render() {
    const { classes } = this.props;
    const form = this.state.loading ? <Loader /> : (
      <form method="post">
        <div className={classes.inputContainer}>
          <label htmlFor="username">Username:</label>
          <input required id="username" className={classes.input} name="username" type="text" />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="password">Password:</label>
          <div className={classes.iconContainer}>
            <i id="pass-icon" className="fas fa-eye-slash hide" onClick={this.showPass}></i>
          </div>
          <input required className={classes.inputPass} type="password" name="password" id="password" />
        </div>
        <button type="submit" onClick={this.login} className={classes.button}>Login</button>
        <div className={classes.forgot}><NavLink to="/forgot">Forgot your password?</NavLink></div>
      </form>
    );
    return (
      <div className={classes.container}>
        {form}
      </div>
    );
  }
  login(e) {
    const { createNotification } = this.props;
    e.preventDefault();
    this.setState({ loading: true });
    this.username = document.getElementById('username').value;
    this.password = document.getElementById('password').value;
    document.getElementById('password').type = "password";
    let user = {
      'username': this.username,
      'password': this.password,
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
  showPass() {
    let iconEl = document.getElementById('pass-icon');
    if (iconEl.classList.contains('fa-eye-slash')) {
      iconEl.classList.remove('fa-eye-slash');
      iconEl.classList.add('fa-eye');
    } else {
      iconEl.classList.remove('fa-eye');
      iconEl.classList.add('fa-eye-slash');
    }
    let passInputEl = document.getElementById('password');
    if (passInputEl.type === 'password') {
      passInputEl.type = 'text';
      passInputEl.style.fontSize = "22px";
    } else {
      passInputEl.type = 'password';
      passInputEl.style.fontSize = "16px";
    }
  }
  componentDidMount() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(Login);