import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
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
  button: {
    padding: `10px`,
    width: `130px`,
    backgroundColor: `#eef9ff`,
    fontSize: `25px`,
    margin: `0 10px`,
    border: `5px solid #dbf0ff`,
    borderRadius: `30px`,
    transition: `font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease`,
    alignSelf: `center`,
    '&:hover': {
      fontWeight: `700`,
      cursor: `pointer`,
      transform: `scale(1.02)`
    }
  },
  input: {
    fontFamily: `'Indie Flower', cursive`,
    float: `right`,
    fontSize: `22px`,
    marginLeft: `20px`,
    background: `#f3fbff`,
    width: `290px`,
    borderRadius: `25px`,
    border: `1px solid #d8efff`,
    padding: `5px 10px 5px 15px`,
    lineHeight: `35px`,
    caretColor: `#a1d2ff`,
    transition: `box-shadow 0.5s ease`,
    '&:focus': {
      boxShadow: `0px 0px 0px 2px #a9dbff`
    }
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
      captchaToken: null
    };
  }
  render() {
    const { classes } = this.props;
    const form = this.state.loading ? (
      <Loader />
    ) : (
        <form method="post">
          <div className={classes.inputContainer}>
            <label htmlFor="username">Username:</label>
            <input required id="username" className={classes.input} name="username" type="text" />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="email">Email:</label>
            <input required id="email" className={classes.input} name="email" type="email" />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="password">Password:</label>
            <div className={classes.iconContainer}>
              <i id="pass-icon" className="fas fa-eye-slash hide" onClick={this.showPass}></i>
            </div>
            <input required className={classes.inputPass} type="password" name="password" id="password" />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="conf-password">Confirm password:</label>
            <div className={classes.iconContainer}>
              <i id="conf-icon" className="fas fa-eye-slash hide" onClick={this.showConfPass}></i>
            </div>
            <input required className={classes.inputPass} type="password" name="conf-password" id="conf-password" />
          </div>
          <Recaptcha
            sitekey="6Lf1HFwUAAAAAAEIUqAnwrGrXJtqqL_ya6tPV7bS"
            verifyCallback={this.recaptchaVerify}
          />
          <button type="submit" onClick={this.register} className={classes.button}>Register</button>
        </form >
      );
    return (
      <div className={classes.container}>
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

export default injectSheet(styles)(Register);