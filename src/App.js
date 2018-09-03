import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import injectSheet from 'react-jss';

import Logout from './components/Logout';
import Nav from './components/Nav';
import User from './components/User';
import Pixels from './components/Pixels';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import ForgotPassword from './components/ForgotPassword';
import Reset from './components/Reset';
import BackgroundCanvas from './components/BackgroundCanvas';
import Notifications from './components/Notifications';
import LoadingPage from './components/LoadingPage';

import { connect } from 'react-redux';
import { tokenCheck } from './actions/AppActions';

import { withRouter } from 'react-router'

const styles = {}

class App extends Component {
  render() {
    const { username, loading, loggedIn, notes, width } = this.props;
    if (loading) {
      return <LoadingPage />;
    } else {
      const routes = loggedIn ? (
        <Switch>
          <Route exact path='/login' render={() => <Redirect to='/pixels' />} />
          <Route exact path='/register' render={() => <Redirect to='/pixels' />} />
          <Route exact path='/profile' component={User} />
          <Route path="/logout" component={Logout} />
          <Route path="/pixels" component={Pixels} />
          <Route exact path="/" component={About} />
          <Route render={() => <Redirect to="/pixels" />} />
        </Switch>
      ) : (
          <Switch>
            <Route exact path='/logout' render={() => <Redirect to="/" />} />
            <Route exact path='/profile' render={() => <Redirect to='/' />} />
            <Route path='/reset/:token' component={Reset} />
            <Route path="/forgot" component={ForgotPassword} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route exact path="/" component={About} />
            <Route render={() => <Redirect to='/' />} />
          </Switch>
        );

      return (
        <div id="App">
          <Notifications notes={notes} />
          <BackgroundCanvas/>
          <Nav username={username} logged={loggedIn} width={width} />
          <div style={width > 1024 ? { marginTop: '60px' } : { marginTop: '45px'}}>{routes}</div>
        </div>
      );
    }

  }
  componentWillMount() {
    tokenCheck();
  }
}

function mapStateToProps(state) {
  const { loading, loggedIn, user, notifications, windowWidth } = state;
  return { loading, loggedIn, username: user.username, notes: notifications, width: windowWidth };
}

export default withRouter(connect(mapStateToProps)(injectSheet(styles)(App)));