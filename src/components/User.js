import React, { Component } from 'react';
import injectSheet from 'react-jss';
import Loader from './Loader';

import AppSettings from './User/AppSettings';

const styles = {
  container: {
    display: `flex`,
    width: `100%`,
    justifyContent: `space-evenly`,
    flexDirection: `row`,
    marginTop: `50px`
  },
  profileSettingsContainer: {
    display: `flex`,
    width: `auto`,
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
  date: {
    float: `right`,
    fontSize: `35px`,
    color: `#364d6b`
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
  buttonsContainer: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`
  },
  submitButton: {
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
  },
  deleteButton: {
    padding: `10px`,
    width: `170px`,
    background: `#ffb3b3`,
    fontSize: `25px`,
    margin: ` 0 10px`,
    border: `5px solid #ff8e8e`,
    borderRadius: `30px`,
    transition: `font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease`,
    alignSelf: `center`,
  }
};

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    let userDate = new Date(+this.props.userCreated);
    this.formatedDate = this.formatDate(`#YYYY#-#MM#-#DD# #hhhh#:#mm#`, userDate);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  render() {
    const { classes } = this.props;
    let userProfileSettings = (
      <div className={classes.profileSettingsContainer}>
        <form method="post">
          <div className={classes.inputContainer}>
            <label>Profile created:</label>
            <span className={classes.date}> {this.formatedDate}</span>
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="username">Username:</label>
            <input id="new-username" className={classes.input} name="username" type="text" defaultValue={this.props.username} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="email">Email:</label>
            <input id="new-email" className={classes.input} name="email" type="email" defaultValue={this.props.userEmail} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="password">New password:</label>
            <div className={classes.iconContainer}>
              <i id="pass-icon" className="fas fa-eye-slash hide" onClick={this.showPass}></i>
            </div>
            <input className={classes.inputPass} type="password" name="password" id="new-password" defaultValue="" />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="conf-password">Confirm new password:</label>
            <div className={classes.iconContainer}>
              <i id="conf-icon" className="fas fa-eye-slash hide" onClick={this.showConfPass}></i>
            </div>
            <input className={classes.inputPass} type="password" name="conf-password" id="conf-new-password" defaultValue="" />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="old-password">Current password:</label>
            <div className={classes.iconContainer}>
              <i id="conf-icon" className="fas fa-eye-slash hide" onClick={this.showOldPass}></i>
            </div>
            <input required className={classes.inputPass} type="password" name="old-password" id="old-password" defaultValue="" />
          </div>
          <div className={classes.buttonsContainer}>
            <button type="submit" onClick={this.deleteUser} className={classes.deleteButton}>Delete account</button>
            <button type="submit" onClick={this.updateUser} className={classes.submitButton}>Update</button>
          </div>
        </form>
      </div>
    );
    return this.state.loading ? (<Loader />) : (
      <div className={classes.container}>
        {userProfileSettings}
        <AppSettings messages={this.props.messages}
          renderMessages={this.props.renderMessages} />
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
    let passInputEl = document.getElementById('new-password');
    if (passInputEl.type === 'password') {
      passInputEl.type = 'text';
      passInputEl.style.fontSize = "22px";
    } else {
      passInputEl.type = 'password';
      passInputEl.style.fontSize = "16px";
    }
  }
  showConfPass() {
    let iconEl = document.getElementById('pass-icon');
    if (iconEl.classList.contains('fa-eye-slash')) {
      iconEl.classList.remove('fa-eye-slash');
      iconEl.classList.add('fa-eye');
    } else {
      iconEl.classList.remove('fa-eye');
      iconEl.classList.add('fa-eye-slash');
    }
    let passInputEl = document.getElementById('conf-new-password');
    if (passInputEl.type === 'password') {
      passInputEl.type = 'text';
      passInputEl.style.fontSize = "22px";
    } else {
      passInputEl.type = 'password';
      passInputEl.style.fontSize = "16px";
    }
  }
  showOldPass() {
    let iconEl = document.getElementById('pass-icon');
    if (iconEl.classList.contains('fa-eye-slash')) {
      iconEl.classList.remove('fa-eye-slash');
      iconEl.classList.add('fa-eye');
    } else {
      iconEl.classList.remove('fa-eye');
      iconEl.classList.add('fa-eye-slash');
    }
    let passInputEl = document.getElementById('old-password');
    if (passInputEl.type === 'password') {
      passInputEl.type = 'text';
      passInputEl.style.fontSize = "22px";
    } else {
      passInputEl.type = 'password';
      passInputEl.style.fontSize = "16px";
    }
  }
  deleteUser(e) {
    e.preventDefault();
    this.setState({ loading: true });
    document.getElementById('messages').innerHTML = "";
    let password = document.getElementById('old-password').value;
    let makeRequest = true;
    if (password === '') {
      makeRequest = false;
      this.props.messages.push({ text: "Enter your password.", type: "error" });
      document.getElementById('old-password').setCustomValidity("Enter your password.");
      this.setState({ loading: false });
    }
    let userData = {
      password: password
    }
    if (makeRequest) {
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('DELETE', `https://api.yearsinpixels.com/api/user`, true);
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.setRequestHeader("x-access-token", token);
      httpRequest.send(JSON.stringify(userData));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              this.props.messages.push({ text: "Succesfully deleted your account!", type: "message" });
              this.setState({ loading: false });
              this.props.renderMessages();
              this.props.removeAccInfo();
            } else {
              this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => console.log(err));
              } else if (response.hasOwnProperty('error')) {
                console.log(response.error)
              } else {
                console.log(response.message);
              }
              this.setState({ loading: false });
              this.props.renderMessages();
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.setState({ loading: false });
          this.props.renderMessages();
        }
      }
    } else {
      this.setState({ loading: false });
      this.props.renderMessages();
    }
  }
  updateUser(e) {
    e.preventDefault();
    this.setState({ loading: true });
    document.getElementById('messages').innerHTML = "";
    let newUsername = document.getElementById('new-username').value;
    let newEmail = document.getElementById('new-email').value;
    let newPassword = document.getElementById('new-password').value;
    let confNewPassword = document.getElementById('conf-new-password').value;
    let oldPassword = document.getElementById(`old-password`).value;
    let newUser = { password: oldPassword };
    let makeRequest = true;
    // validate inputs
    if (oldPassword === '') {
      makeRequest = false;
      this.props.messages.push({ text: "Enter your password.", type: "error" });
      document.getElementById('old-password').setCustomValidity("Enter your password.");
      this.setState({ loading: false });
    } else {
      if (newPassword !== "") {
        newUser.newPassword = newPassword;
        if (newPassword !== confNewPassword) {
          this.props.messages.push({ text: "Passwords do not match.", type: "error" })
          makeRequest = false;
          document.getElementById('new-password').setCustomValidity("Passwords do not match.")
          document.getElementById('conf-new-password').setCustomValidity("Passwords do not match.")
        }
        if (newPassword.length < 8) {
          makeRequest = false;
          this.props.messages.push({ text: `Minimum password length is 8 characters.`, type: "error" });
          document.getElementById('new-password').setCustomValidity("Minimum password length is 8 characters.")
        } else if (newPassword.length > 128) {
          makeRequest = false;
          this.props.messages.push({ text: `Maximum password length is 128 characters.`, type: "error" });
          document.getElementById('new-password').setCustomValidity("Maximum password length is 128 characters.")
        } else {
          let passwordRegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/g;
          if (!passwordRegExp.test(newPassword)) {
            makeRequest = false;
            document.getElementById('new-password').setCustomValidity("Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter.")
            this.props.messages.push({ text: `Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter.`, type: "error" });
          }
        }
      }
      if (newEmail !== "") {
        newUser.newEmail = newEmail;
        let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegEx.test(newEmail)) {
          makeRequest = false;
          this.props.messages.push({ text: 'Email adress is invalid.', type: "error" });
          document.getElementById('new-email').setCustomValidity("Email adress is invalid.");
        }
      }
      if (newUsername !== "") {
        newUser.newUsername = newUsername;
        if (newUsername.length < 5) {
          this.props.messages.push({ text: `Username must be higher than 5 characters.`, type: "error" });
          document.getElementById('new-username').setCustomValidity("Username must be higher than 5 characters.");
          makeRequest = false;
        } else if (newUsername.length > 35) {
          makeRequest = false;
          this.props.messages.push({ text: `Username must be lower than 32 characters.`, type: "error" });
          document.getElementById('new-username').setCustomValidity("Username must be lower than 32 characters.");
        }
      }
    }
    if (makeRequest) {
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('PUT', `https://api.yearsinpixels.com/api/user`, true);
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.setRequestHeader("x-access-token", token);
      httpRequest.send(JSON.stringify(newUser));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 201) {
              this.props.messages.push({ text: "Succesfully updated your information!", type: "message" });
              let response = JSON.parse(httpRequest.responseText);
              document.cookie = `token=${response.token}`;
              document.cookie = `username=${response.data.username}`;
              document.cookie = `userID=${response.data.id}`;
              document.cookie = `userCreated=${response.data.dateCreated}`;
              document.cookie = `userEmail=${response.data.email}`;
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => this.props.messages.push({ text: err, type: "error" }));
              } else if (response.hasOwnProperty('error')) {
                this.props.messages.push({ text: response.error, type: 'error' });
              } else {
                this.props.messages.push({ text: response.message, type: "error" })
              }
            }
            this.setState({ loading: false });
            this.props.renderMessages();
            this.props.updateStates();
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.setState({ loading: false });
          this.props.renderMessages();
        }
      }
    } else {
      this.setState({ loading: false });
      this.props.renderMessages();
    }
  }
  componentDidMount() {
    this.props.removeMessages();
    this.props.resizeBackground();
  }
  formatDate = function (formatString, date) {
    var YYYY, MM, DD, hhhh, mm;
    YYYY = date.getFullYear()
    MM = date.getMonth() + 1 < 10 ? (`0` + (date.getMonth() + 1)) : date.getMonth + 1;
    DD = date.getDate() < 10 ? (`0` + date.getDate()) : date.getDate();
    formatString = formatString.replace("#YYYY#", YYYY).replace("#MM#", MM).replace("#DD#", DD);
    hhhh = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
    mm = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
    return formatString.replace("#hhhh#", hhhh).replace("#mm#", mm);
  };
}

export default injectSheet(styles)(User);