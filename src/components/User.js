import React, { Component } from 'react';
import Loader from './Loader';
import './User.css';

class Mood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removed: false,
      edit: false,
      moodName: this.props.mood.moodName,
      moodColor: this.props.mood.moodColor
    };
    this.removeMood = this.removeMood.bind(this);
    this.editMood = this.editMood.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }
  render() {
    let mood = this.state.edit ? (
      <div className="mood">
        <input type="text" defaultValue={this.state.moodName} className="input mood-name-input" id="edit-mood-name-input" placeholder="Enter pixels name" onChange={this.handleNameChange} />
        <input type="color" value={this.state.moodColor} className="mood-color-input" id="edit-mood-color-input" onChange={this.handleColorChange} />
        <i className="fas fa-save save-mood" onClick={this.editMood}></i>
        <i className="fas fa-times cancel-save-mood" onClick={this.handleEditClick}></i>
      </div>
    ) : (
        <div className="mood">
          <label className="mood-label" >{this.state.moodName}</label>
          <input type="color" className="mood-color-input" value={this.state.moodColor} readOnly />
          <i className="fas fa-edit mood-edit" onClick={this.handleEditClick}></i>
          <i className="fas fa-trash-alt mood-remove" onClick={this.removeMood}></i>
        </div>
      );
    let element = this.state.removed ? null : mood;
    return element;
  }
  handleEditClick() {
    this.setState({ edit: !this.state.edit })
  }
  handleNameChange(event) {
    this.setState({ moodName: event.target.value });
  }
  handleColorChange(event) {
    this.setState({ moodColor: event.target.value });
  }
  removeMood() {
    this.setState({ removed: true });
    // eslint-disable-next-line
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let httpRequest = new XMLHttpRequest();
    let remove = {
      moodID: this.props.mood.moodID
    };
    httpRequest.open('DELETE', `https://api.yearsinpixels.com/api/user/mood`, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.setRequestHeader("x-access-token", token);
    httpRequest.send(JSON.stringify(remove));
    httpRequest.onreadystatechange = () => {
      try {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            // do nothing
          } else {
            let response = JSON.parse(httpRequest.responseText);
            if (response.hasOwnProperty('error')) {
              this.props.messages.push({ text: response.error, type: 'error' });
            } else {
              this.props.messages.push({ text: response.message, type: "error" })
            }
            this.setState({ removed: false });
          }
          this.props.renderMessages();
        }
      } catch (e) {
        console.error(`Caught error: `, e);
        this.props.messages.push({ text: e, type: "error" });
        this.props.renderMessages();
      }
    }
  }
  editMood() {
    document.getElementById('messages').innerHTML = '';
    let makeRequest = true;
    if (this.state.moodName === '') {
      makeRequest = false;
      document.getElementById('edit-mood-name-input').setCustomValidity("Enter pixels name!");
      this.props.messages.push({ text: "Please enter pixels name", type: "error" });
    } else if (this.state.moodName.length > 50) {
      makeRequest = false;
      document.getElementById('edit-mood-name-input').setCustomValidity(`Pixels name can't be longer than 50 characters!`);
      this.props.messages.push({ text: `Pixels name can't be longer than 50 characters!`, type: "error" });
    }
    if (makeRequest) {
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      let httpRequest = new XMLHttpRequest();
      let mood = {
        moodName: this.state.moodName,
        moodColor: this.state.moodColor,
        moodID: this.props.mood.moodID
      };
      httpRequest.open('PUT', `https://api.yearsinpixels.com/api/user/mood`, true);
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.setRequestHeader("x-access-token", token);
      httpRequest.send(JSON.stringify(mood));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              this.setState({
                edit: false,
              })
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
            this.props.renderMessages();
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.props.renderMessages();
        }
      }
    } else {
      this.props.renderMessages();
    }
  }
}
class AddMood extends Component {
  constructor(props) {
    super(props);
    this.addMood = this.addMood.bind(this);
  }
  render() {
    return (
      <div className="mood mood-form">
        <input type="text" className="input mood-name-input" id="mood-name-input" placeholder="Enter pixel name" />
        <input type="color" className="mood-color-input" id="mood-color-input" />
        <button type="submit" className="mood-add-button" onClick={this.addMood}>Add</button>
      </div>
    );
  }
  addMood() {
    document.getElementById('messages').innerHTML = '';
    let moodName = document.getElementById('mood-name-input').value;
    let moodColor = document.getElementById('mood-color-input').value;
    let makeRequest = true;
    if (moodName === '') {
      makeRequest = false;
      document.getElementById('mood-name-input').setCustomValidity("Enter mood name!");
      this.props.messages.push({ text: "Please enter a mood name", type: "error" });
    } else if (moodName.length > 50) {
      makeRequest = false;
      document.getElementById('mood-name-input').setCustomValidity(`Mood name can't be longer than 50 characters!`);
      this.props.messages.push({ text: `Mood name can't be longer than 50 characters!`, type: "error" });
    }
    if (makeRequest) {
      document.getElementById('mood-name-input').value = '';
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      let httpRequest = new XMLHttpRequest();
      let mood = {
        moodName: moodName,
        moodColor: moodColor
      };

      httpRequest.open('POST', `https://api.yearsinpixels.com/api/user/mood`, true);
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.setRequestHeader("x-access-token", token);
      httpRequest.send(JSON.stringify(mood));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              this.props.getMoods();
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
            this.props.renderMessages();
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.props.renderMessages();
        }
      }
    } else {
      this.props.renderMessages();
    }
  }
}
class AppSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moods: undefined
    }
    this.getMoods = this.getMoods.bind(this);
  }
  render() {
    return (
      <div className="app-settings-wrap">
        <div className="moods-label"><span className="label">Pixels</span></div>
        <div className="moods" id="moods">
          {this.state.moods}
          <AddMood getMoods={this.getMoods} messages={this.props.messages}
            renderMessages={this.props.renderMessages} />
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.getMoods();
  }
  getMoods() {
    // eslint-disable-next-line
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('GET', `https://api.yearsinpixels.com/api/user/mood`, true);
      httpRequest.setRequestHeader("x-access-token", `${token}`);
      httpRequest.send();
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              let response = JSON.parse(httpRequest.responseText);
              let moods = response.moods.map(mood => (
                <Mood mood={mood} key={mood.moodID} messages={this.props.messages}
                  renderMessages={this.props.renderMessages} />
              ));
              this.setState({
                moods: moods
              });
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => this.props.messages.push({ text: err, type: "error" }));
              } else {
                this.props.messages.push({ text: response.message, type: "error" })
              }
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
  }
}
export class User extends Component {
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
    let userProfileSettings = (
      <div className="profile-wrap">
        <form method="post">
          <div className="label">Profile created:
            <span className="profile-date"> {this.formatedDate}</span>
          </div>
          <div className="input-wrap">
            <label htmlFor="username">Username:</label>
            <input id="new-username" className="input" name="username" type="text" defaultValue={this.props.username} />
          </div>
          <div className="input-wrap">
            <label htmlFor="email">Email:</label>
            <input id="new-email" className="input" name="email" type="email" defaultValue={this.props.userEmail} />
          </div>
          <div className="input-wrap">
            <label htmlFor="password">New password:</label>
            <div className="icon-wrap">
              <i id="pass-icon" className="fas fa-eye-slash hide" onClick={this.showPass}></i>
            </div>
            <input className="input pass" type="password" name="password" id="new-password" defaultValue="" />
          </div>
          <div className="input-wrap">
            <label htmlFor="conf-password">Confirm new password:</label>
            <div className="icon-wrap">
              <i id="conf-icon" className="fas fa-eye-slash hide" onClick={this.showConfPass}></i>
            </div>
            <input className="input pass" type="password" name="conf-password" id="conf-new-password" defaultValue="" />
          </div>
          <div className="input-wrap">
            <label htmlFor="old-password">Current password:</label>
            <div className="icon-wrap">
              <i id="conf-icon" className="fas fa-eye-slash hide" onClick={this.showOldPass}></i>
            </div>
            <input required className="input pass" type="password" name="old-password" id="old-password" defaultValue="" />
          </div>
          <div className="button-wrap">
            <button type="submit" onClick={this.deleteUser} className="deleteUser-button">Delete account</button>
            <button type="submit" onClick={this.updateUser} className="submit-button">Update</button>
          </div>
        </form>
      </div>
    );
    return this.state.loading ? (<Loader />) : (
      <div className="settings-wrap">
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