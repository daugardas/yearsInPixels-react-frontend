import React, { Component } from 'react';
import injectSheet from 'react-jss';

import SubmitButton from './SubmitButton'
import EmailInput from './Inputs/EmailInput';
import InputContainer from './Inputs/InputContainer';
import TextInput from './Inputs/TextInput';

import { connect } from 'react-redux';
import { forgot, emailChange, usernameChange } from '../actions/passwordActions';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 180, 
    position: 'relative',
    width: 'max-content',
    left: '50%',
    transform: 'translateX(-50%)',
    '& form': {
      display: `flex`,
      flexDirection: `column`
    }
  },
  or: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& span': {
      fontSize: 30
    }
  }
  /* will add mobile support */
};

export class ForgotPassword extends Component {
  render() {
    const { classes, email, username } = this.props;

    return (
      <div className={classes.container}>
        <form method="post">
          <InputContainer label='Email:'>
            <EmailInput value={email} onChange={emailChange} />
          </InputContainer>
          <div className={classes.or}><span>OR</span></div>
          <InputContainer label='Username:'>
            <TextInput value={username} onChange={usernameChange} />
          </InputContainer>
          <SubmitButton onClick={forgot}>Submit</SubmitButton>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { email: state.forgot.email, username: state.forgot.username }
}

export default connect(mapStateToProps)(injectSheet(styles)(ForgotPassword));