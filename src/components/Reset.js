import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: null,
      username: "",
      recoverToken: null,
      redirectHome: false,
      redirectForgot: false,
      redirectLogin: false
    };
    this.recover = this.recover.bind(this);
  }
  render() {
    const { classes } = this.props;
    const form = this.state.loading ? <Loader /> : (
      <form method="post">
        <div className={classes.inputContainer}>
          <label htmlFor="username">Username:</label>
          <input id="username" className={classes.input} name="username" type="text" value={this.state.username} readOnly />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="password">New password:</label>
          <div className={classes.iconContainer}>
            <i id="pass-icon" className="fas fa-eye-slash hide" onClick={this.showPass}></i>
          </div>
          <input required className={classes.inputPass} type="password" name="password" id="password" />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="conf-password">Confirm new password:</label>
          <div className={classes.iconContainer}>
            <i id="conf-icon" className="fas fa-eye-slash hide" onClick={this.showConfPass}></i>
          </div>
          <input required className={classes.inputPass} type="password" name="conf-password" id="conf-password" />
        </div>
        <button type="submit" onClick={this.recover} className={classes.button}>Recover</button>
      </form>
    );
    return (
      <div className={classes.container}>
        {this.redirect()}
        {form}
      </div>
    );
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
  recover(e) {
    e.preventDefault();
    this.setState({ loading: true })
    const newPassword = document.getElementById('password').value;
    const confNewPassword = document.getElementById('conf-password').value;
    document.getElementById('password').setCustomValidity('');
    document.getElementById('conf-password').setCustomValidity('');
    let makeRequest = true;

    let passwordRegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/g;
    if (newPassword !== confNewPassword) {
      this.props.messages.push({ text: "Passwords do not match.", type: "error" })
      makeRequest = false;
      document.getElementById('password').setCustomValidity("Passwords do not match.")
      document.getElementById('conf-password').setCustomValidity("Passwords do not match.")
    } else if (newPassword.length < 8) {
      makeRequest = false;
      this.props.messages.push({ text: `Minimum password length is 8 characters.`, type: "error" });
      document.getElementById('password').setCustomValidity("Minimum password length is 8 characters.")
    } else if (newPassword.length > 128) {
      makeRequest = false;
      this.props.messages.push({ text: `Maximum password length is 128 characters.`, type: "error" });
      document.getElementById('password').setCustomValidity("Maximum password length is 128 characters.")
    } else if (!passwordRegExp.test(newPassword)) {
      makeRequest = false;
      document.getElementById('password').setCustomValidity("Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter.")
      this.props.messages.push({ text: `Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter.`, type: "error" });
    }

    if (makeRequest) {
      let data = {
        id: this.state.id,
        recoverToken: this.state.recoverToken,
        newPassword: newPassword
      };
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', `https://api.yearsinpixels.com/api/recover`, true);
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      httpRequest.send(JSON.stringify(data));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            let response = JSON.parse(httpRequest.responseText);
            if (httpRequest.status === 200) {
              this.props.messages.push({ text: response.message, type: 'message' });
              this.setState({ redirectLogin: true });
            } else {
              this.props.messages.push({ text: response.message, type: 'error' })
              this.setState({ redirectForgot: true });
            }
            this.props.renderMessages();
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.setState({ loading: false });
          this.props.renderMessages();
        }
      }
    } else {
      this.setState({ loading: false })
    }
  }
  requestRecover() {
    document.getElementById('messages').innerHTML = "";
    let token = this.props.token;
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', `https://api.yearsinpixels.com/api/forgot`, true);
    httpRequest.setRequestHeader("Authorization", token);
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      try {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            let response = JSON.parse(httpRequest.responseText);
            this.setState({
              loading: false,
              id: response.id,
              username: response.username,
              recoverToken: response.recoverToken,
            });
          } else {
            this.setState({ redirectHome: true });
          }
        }
      } catch (e) {
        console.error(`Caught error: `, e);
        this.props.messages.push({ text: e, type: "error" });
        this.setState({ loading: false });
        this.props.renderMessages();
      }
    }
  }
  redirect() {
    if (this.state.redirectHome) {
      return <Redirect to='/' />
    } else if (this.state.redirectForgot) {
      return <Redirect to='/forgot' />
    } else if (this.state.redirectLogin) {
      return <Redirect to='/login' />
    }
  }
  componentDidMount() {
    this.props.removeMessages();
    this.props.resizeBackground();
    this.requestRecover();
  }
}

export default injectSheet(styles)(Reset);