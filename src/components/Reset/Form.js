import React, { Component } from 'react';

import InputContainer from '../Inputs/InputContainer';
import PasswordInput from '../Inputs/PasswordInput';
import SubmitButton from '../SubmitButton';

import { reset, newPassChange, confNewPassChange } from '../../actions/passwordActions';

class Form extends Component {
  render() {
    const { password, confPassword } = this.props;
    return (
      <form method="post">

        <InputContainer label='New password:'>
          <PasswordInput value={password} onChange={newPassChange} required />
        </InputContainer>

        <InputContainer label='Confirm new password:'>
          <PasswordInput value={confPassword} onChange={confNewPassChange} required />
        </InputContainer>

        <SubmitButton onClick={reset}>Submit</SubmitButton>

      </form>
    );
  }
}

export default Form;