import React, { Component } from 'react';
import injectSheet from 'react-jss';

import formatDate from '../../functions/formatDate';
import InputContainer from '../InputContainer';
import TextInput from '../TextInput';
import PasswordInput from '../PasswordInput';
import EmailInput from '../EmailInput';
import SubmitButton from '../SubmitButton';
import ButtonsContainer from '../ButtonsContainer';

const styles = {
  container: {
    display: 'flex',
    width: 'auto',
    height: 'auto',
    '& form': {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  date: {
    float: 'right',
    fontSize: 35,
    color: '#364d6b'
  }
};

class ProfileSettings extends Component {
  constructor(props) {
    super(props);
    const { created, username, email } = props;
    this.state = {
      date: formatDate('#YYYY#-#MM#-#DD# #hhhh#:#mm#', new Date(+created)),
      username: username,
      email: email,
      password: '',
      newPassword: '',
      confNewPassword: ''
    }
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  render() {
    const { classes } = this.props;
    const { date, username, email, password, newPassword, confNewPassword } = this.state;
    return <div className={classes.container}>
      <form method="post">

        <InputContainer label='Profile Created:'>
          <span className={classes.date}>{date}</span>
        </InputContainer>

        <InputContainer label='Username:'>
          <TextInput required onChange={this.handleUsernameChange.bind(this)} value={username} />
        </InputContainer>

        <InputContainer label='Email:'>
          <EmailInput required value={email} onChange={this.handleEmailChange.bind(this)} />
        </InputContainer>

        <InputContainer label='NewPassword:'>
          <PasswordInput onChange={this.handleNewPasswordChange.bind(this)} value={newPassword} />
        </InputContainer>

        <InputContainer label='Confirm new password:'>
          <PasswordInput value={confNewPassword} onChange={this.handleConfNewPasswordChange.bind(this)} />
        </InputContainer>

        <InputContainer label='Current password:'>
          <PasswordInput required value={password} onChange={this.handlePasswordChange.bind(this)} />
        </InputContainer>

        <ButtonsContainer>
          <SubmitButton warning onClick={this.deleteUser}>Delete account</SubmitButton>
          <SubmitButton onClick={this.updateUser}>Update</SubmitButton>
        </ButtonsContainer>

      </form>
    </div>
  }

  handleUsernameChange(val) {
    this.setState({ username: val })
  }

  handleEmailChange(val) {
    this.setState({ email: val });
  }

  handlePasswordChange(val) {
    this.setState({ password: val });
  }

  handleNewPasswordChange(val) {
    this.setState({ newPassword: val });
  }

  handleConfNewPasswordChange(val) {
    this.setState({ confNewPassword: val });
  }

  deleteUser() {
    const { createNotification, removeAccInfo } = this.props;
    const { password } = this.state;

    let makeRequest = true;

    if (password === '') {
      makeRequest = false;
      createNotification('error', 'Enter your password.');
    }

    let userData = {
      password: password
    };

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
              createNotification('success', "Succesfully deleted your account!")
              removeAccInfo();
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.array.forEach(err => {
                  console.log(err);
                  createNotification('error', err);
                });
              } else if (response.hasOwnProperty('error')) {
                console.log(response.error)
                createNotification('error', response.error);
              } else {
                console.log(response.message);
                createNotification('error', response.message);
              }
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
        }
      }
    } else {
    }
  }

  updateUser() {
    const { createNotification, updateStates } = this.props;
    const { username, email, password, newPassword, confNewPassword } = this.state;

    let user = { password: password };
    let makeRequest = true;

    // validate inputs
    if (password === '') {
      makeRequest = false;
      createNotification('error', 'Enter your password.');
    } else {
      if (newPassword !== "") {
        user.newPassword = newPassword;

        if (newPassword !== confNewPassword) {
          createNotification('error', "Passwords do not match.");
          makeRequest = false;
        }

        if (newPassword.length < 8) {
          makeRequest = false;
          createNotification('error', "Minimum password length is 8 characters.");
        } else if (newPassword.length > 128) {
          makeRequest = false;
          createNotification('error', "Maximum password length is 128 characters.");
        } else {
          let passwordRegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/g;
          if (!passwordRegExp.test(newPassword)) {
            makeRequest = false;
            createNotification('error', "Password must be have one lowercase letter and one number or one lowecase letter and uppercase letter");
          }
        }
      }

      if (email !== "") {
        user.newEmail = email;
        let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegEx.test(email)) {
          makeRequest = false;
          createNotification('error', "Email adress is invalid.");
        }
      }

      if (username !== "") {
        user.newUsername = username;

        if (username.length < 2) {
          createNotification('error', "Username must be longer than 2 characters.");
          makeRequest = false;
        } else if (username.length > 35) {
          makeRequest = false;
          createNotification('error', "Username must be shorter than 32 characters.");
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
      httpRequest.send(JSON.stringify(user));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 201) {
              createNotification('success', "Succesfully updated your information!");

              let response = JSON.parse(httpRequest.responseText);

              document.cookie = `token=${response.token}`;
              document.cookie = `username=${response.data.username}`;
              document.cookie = `userID=${response.data.id}`;
              document.cookie = `userCreated=${response.data.dateCreated}`;
              document.cookie = `userEmail=${response.data.email}`;
            } else {
              let response = JSON.parse(httpRequest.responseText);

              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => createNotification('error', err));
              } else if (response.hasOwnProperty('error')) {
                createNotification('error', response.error);
              } else {
                createNotification('error', response.message);
              }
            }
            updateStates();
            this.setState({ password: '', newPassword: '', confNewPassword: ''})
          }
        } catch (e) {
          console.error(`Caught error: `, e);
        }
      }
    }
  }
}

export default injectSheet(styles)(ProfileSettings);