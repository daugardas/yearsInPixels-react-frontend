import React, { Component } from 'react';
import injectSheet from 'react-jss';

import formatDate from '../../functions/formatDate';
import InputContainer from '../Inputs/InputContainer';
import TextInput from '../Inputs/TextInput';
import PasswordInput from '../Inputs/PasswordInput';
import EmailInput from '../Inputs/EmailInput';
import SubmitButton from '../SubmitButton';
import ButtonsContainer from '../ButtonsContainer';

import { updateProfile, deleteProfile } from '../../actions/UserActions';

const styles = {
  container: {
    marginTop: 20,
    '& form': {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '#364d6b 1px solid',
    '& span': {
      fontSize: 35,
      color: '#364d6b'
    }
  },
  date: {
    float: 'right',
    fontSize: 35,
    color: '#364d6b'
  },
  '@media (max-width: 650px)': {
    container: {
      width: '95%'
    }
  },
  '@media (min-width: 650px) and (max-width: 960px)': {
    container: {
      width: '44%'
    }
  }
};

class ProfileSettings extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    const { created, username, email } = user;
    this.state = {
      date: formatDate('#YYYY#-#MM#-#DD# #hhhh#:#mm#', new Date(+created)),
      username: username,
      email: email,
      password: '',
      newPassword: '',
      confNewPassword: ''
    }
  }
  render() {
    const { classes, width } = this.props;
    const { date, username, email, password, newPassword, confNewPassword } = this.state;
    return (
    <div className={classes.container}>
    
      <form method="post">
        {
          width <= 650 ? (<div className={classes.headerContainer}>
          <span>Profile settings</span>
        </div>) : null
        }
        <InputContainer label='Profile Created:'>
          <span className={classes.date}>{date}</span>
        </InputContainer>

        <InputContainer label='Username:'>
          <TextInput required onChange={this.handleUsernameChange.bind(this)} value={username} />
        </InputContainer>

        <InputContainer label='Email:'>
          <EmailInput required value={email} onChange={this.handleEmailChange.bind(this)} />
        </InputContainer>

        <InputContainer label='New password:'>
          <PasswordInput onChange={this.handleNewPasswordChange.bind(this)} value={newPassword} />
        </InputContainer>

        <InputContainer label='Confirm new password:'>
          <PasswordInput value={confNewPassword} onChange={this.handleConfNewPasswordChange.bind(this)} />
        </InputContainer>

        <InputContainer label='Current password:'>
          <PasswordInput required value={password} onChange={this.handlePasswordChange.bind(this)} />
        </InputContainer>

        <ButtonsContainer>
          <SubmitButton warning onClick={this.deleteUser.bind(this)}>Delete account</SubmitButton>
          <SubmitButton onClick={this.updateUser.bind(this)}>Update</SubmitButton>
        </ButtonsContainer>

      </form>
    </div>
    )
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
    const { password } = this.state;
    deleteProfile(password);
  }

  updateUser() {
    const { username, email, password, newPassword, confNewPassword } = this.state;
    updateProfile(username, email, password, newPassword, confNewPassword);
  }
}

export default injectSheet(styles)(ProfileSettings);