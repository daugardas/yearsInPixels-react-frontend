import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import injectSheet from 'react-jss';

import Form from './Reset/Form';
import LoadingPage from './LoadingPage';
import { connect } from 'react-redux';
import { requestReset } from '../actions/passwordActions';

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
  }
};

class Reset extends Component {
  render() {
    const { classes, password, confPassword, username, loading } = this.props;
    return loading ? <LoadingPage /> : (
      <div className={classes.container}>
        {this.redirect()}
        <div>
          <span>Hello {username}, please reset your password here:</span>
        </div>
        <Form password={password} confPassword={confPassword} />
      </div>
    );
  }
  redirect() {
    const { redirectTo } = this.props;

    if (redirectTo !== '') {
      return <Redirect to={redirectTo} />
    }
  }
  componentDidMount() {
    const { token } = this.props.match.params;
    requestReset(token);
  }
}

function mapStateToProps(state) {
  const { loading, username, redirectTo, password, confPassword } = state.reset;
  return { loading, username, redirectTo, password, confPassword };
}

export default connect(mapStateToProps)(injectSheet(styles)(Reset));