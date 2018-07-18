import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { connect } from 'react-redux';
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
    const { classes, user } = this.props;
    
    return <div className={classes.container}>
      <ProfileSettings user={user}/>
      <AppSettings moods={user.moods} />
    </div>
  }
}

function mapStateToProps(state) {
  return { user: state.user }
}

export default connect(mapStateToProps)(injectSheet(styles)(User));