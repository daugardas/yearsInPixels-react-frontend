import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import Loader from './Loader';
export class Register extends Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    this.recaptchaVerify = this.recaptchaVerify.bind(this);
    this.state = {
      loading: false,
      captchaVerified: false,
      captchaToken: null
    };
  }
  render() {
    const form = this.state.loading ? (
      <Loader />
    ) : (
        <form method="post">
          <div className="input-wrap">
            <label htmlFor="username">Username:</label>
            <input required id="username" className="input" name="username" type="text" />
          </div>
          <div className="input-wrap">
            <label htmlFor="email">Email:</label>
            <input required id="email" className="input" name="email" type="email" />
          </div>
          <div className="input-wrap">
            <label htmlFor="password">Password:</label>
            <div className="icon-wrap">
              <i id="pass-icon" className="fas fa-eye-slash hide" onClick={this.showPass}></i>
            </div>
            <input required className="input pass" type="password" name="password" id="password" />
          </div>
          <div className="input-wrap">
            <label htmlFor="conf-password">Confirm password:</label>
            <div className="icon-wrap">
              <i id="conf-icon" className="fas fa-eye-slash hide" onClick={this.showConfPass}></i>
            </div>
            <input required className="input pass" type="password" name="conf-password" id="conf-password" />
          </div>
          <Recaptcha
            sitekey="6Lf1HFwUAAAAAAEIUqAnwrGrXJtqqL_ya6tPV7bS"
            verifyCallback={this.recaptchaVerify}
          />
          <button type="submit" onClick={this.register} className="submit-button">Register</button>
        </form >
      );
    return (
      <div className="form-wrapper">
        {form}
      </div>
    );
  }
  recaptchaVerify(response) {
    this.setState({ captchaVerified: true, captchaToken: response });
  }
  register(e) {
    e.preventDefault();
    document.getElementById('messages').innerHTML = "";
    if (this.state.captchaVerified) {
      this.setState({ loading: true });
      this.username = document.getElementById('username').value;
      this.email = document.getElementById('email').value;
      this.password = document.getElementById('password').value;
      this.confPassword = document.getElementById('conf-password').value;
      let makeRequest = true;
      // validate email and passwords
      if (this.password !== this.confPassword) {
        this.props.messages.push({ text: "Passwords do not match.", type: "error" })
        makeRequest = false;
        document.getElementById('password').setCustomValidity("Passwords do not match.")
        document.getElementById('conf-password').setCustomValidity("Passwords do not match.")
      }
      if (this.password.length < 8) {
        makeRequest = false;
        this.props.messages.push({ text: `Minimum password length is 8 characters.`, type: "error" });
        document.getElementById('password').setCustomValidity("Minimum password length is 8 characters.")
      } else if (this.password.length > 128) {
        makeRequest = false;
        this.props.messages.push({ text: `Maximum password length is 128 characters.`, type: "error" });
        document.getElementById('password').setCustomValidity("Maximum password length is 128 characters.")
      } else {
        let passwordRegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/g;
        if (!passwordRegExp.test(this.password)) {
          makeRequest = false;
          document.getElementById('password').setCustomValidity("Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter.")
          this.props.messages.push({ text: `Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter.`, type: "error" });
        }
      }
      // check email
      let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegEx.test(this.email)) {
        makeRequest = false;
        this.props.messages.push({ text: 'Email adress is invalid.', type: "error" });
        document.getElementById('email').setCustomValidity("Email adress is invalid.");
      }
      // check username
      if (this.username.length < 5) {
        this.props.messages.push({ text: `Username must be higher than 5 characters.`, type: "error" });
        document.getElementById('username').setCustomValidity("Username must be higher than 5 characters.");
        makeRequest = false;
      } else if (this.username.length > 35) {
        makeRequest = false;
        this.props.messages.push({ text: `Username must be lower than 32 characters.`, type: "error" });
        document.getElementById('username').setCustomValidity("Username must be lower than 32 characters.");
      }
      if (makeRequest) {
        let data = {
          'username': this.username,
          'email': this.email,
          'password': this.password,
          'recaptchaResponse': this.state.captchaToken
        }
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', `https://api.yearsinpixels.com/api/register`, true);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(data));
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 201) {
                this.props.messages.push({ text: "Succesfully registered, now you can login!", type: "message" });
              } else if (httpRequest.status === 429) {
                let response = JSON.parse(httpRequest.responseText);
                this.props.messages.push({ text: response.error, type: 'error' });
              } else {
                let response = JSON.parse(httpRequest.responseText);
                if (response.hasOwnProperty('errors')) {
                  response.errors.map(err => this.props.messages.push({ text: err, type: "error" }));
                } else if (response.hasOwnProperty('error')) {
                  this.props.messages.push({ text: response.error, type: "error" });
                } else {
                  this.props.messages.push({ text: response.message, type: "error" })
                }
              }
              this.props.renderMessages();
              this.setState({ loading: false });
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.props.messages.push({ text: e, type: "error" });
            this.props.renderMessages();
            this.setState({ loading: false });
          }
        }
      } else {
        this.props.renderMessages();
        this.setState({ loading: false });
      }
    } else {
      this.props.messages.push({ text: "Verify that you're not a robot.", type: "error" });
      this.props.renderMessages();
      this.setState({ loading: false });
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
  showConfPass() {
    let iconEl = document.getElementById('conf-icon');
    if (iconEl.classList.contains('fa-eye-slash')) {
      iconEl.classList.remove('fa-eye-slash');
      iconEl.classList.add('fa-eye');
    } else {
      iconEl.classList.remove('fa-eye');
      iconEl.classList.add('fa-eye-slash');
    }
    let passInputEl = document.getElementById('conf-password');
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