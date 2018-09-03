import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { connect } from 'react-redux';
import AppSettings from './User/AppSettings';
import ProfileSettings from './User/ProfileSettings';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  '@media (max-width: 650px)': {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }
  }
};

class User extends Component {
  render() {
    const { classes, user, width } = this.props;
    
    return <div className={classes.container}>
      <AppSettings moods={user.moods} width={width} />
      <ProfileSettings user={user} width={width}/>
    </div>
  }
}

function mapStateToProps(state) {
  return { user: state.user, width: state.windowWidth }
}

export default connect(mapStateToProps)(injectSheet(styles)(User));