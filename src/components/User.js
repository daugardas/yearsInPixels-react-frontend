import React, { Component } from 'react';
import injectSheet from 'react-jss';

import AppSettings from './User/AppSettings';
import ProfileSettings from './User/ProfileSettings';

const styles = {
  container: {
    display: `flex`,
    width: `100%`,
    justifyContent: `space-evenly`,
    flexDirection: `row`,
    marginTop: `50px`
  }
};

class User extends Component {
  render() {
    const { classes, username, userEmail, userCreated, createNotification, removeNotifications, removeAccInfo, updateStates } = this.props;
    return <div className={classes.container}>
      <ProfileSettings createNotification={createNotification} username={username} email={userEmail} created={userCreated} removeAccInfo={removeAccInfo} updateStates={updateStates}/>
      <AppSettings removeNotifications={removeNotifications} createNotification={createNotification} />
    </div>
  }
  componentDidMount() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(User);