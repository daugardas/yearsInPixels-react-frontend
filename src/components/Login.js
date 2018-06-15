import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Loader from './Loader';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.login = this.login.bind(this);
  }
  render() {
    const form = this.state.loading ? <Loader /> : (
      <form method="post">
        <div className="input-wrap">
          <label htmlFor="username">Username:</label>
          <input required id="username" className="input" name="username" type="text" />
        </div>
        <div className="input-wrap">
          <label htmlFor="password">Password:</label>
          <div className="icon-wrap">
            <i id="pass-icon" className="fas fa-eye-slash hide" onClick={this.showPass}></i>
          </div>
          <input required className="input pass" type="password" name="password" id="password" />
        </div>
        <button type="submit" onClick={this.login} className="submit-button">Login</button>
        <div className="forgot-pass"><NavLink to="/forgot">Forgot your password?</NavLink></div>
      </form>
    );
    return (
      <div className="form-wrapper">
        {form}
      </div>
    );
  }
  login(e) {
    e.preventDefault();
    this.setState({ loading: true });
    document.getElementById('messages').innerHTML = "";
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
            this.props.messages.push({text: "Succesfully logged in!", type: "message"});
            this.props.renderMessages();
            this.setState({ loading: false });
            this.props.login();
          } else {
            let response = JSON.parse(httpRequest.responseText);
            if (response.hasOwnProperty('errors')) {
              response.errors.map(err => this.props.messages.push({ text: err, type: "error" }));
            } else if(response.hasOwnProperty('error')){
              this.props.messages.push({text: response.error, type: "error"});
            } else {
              this.props.messages.push({ text: response.message, type: "error" })
            }
            this.setState({ loading: false });
            this.props.renderMessages();
          }
        }
      } catch (e) {
        console.error(`Caught error: `, e);
        this.props.messages.push({ text: e, type: "error" });
        this.props.renderMessages();
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
    this.props.removeMessages();
    this.props.resizeBackground();
  }
}