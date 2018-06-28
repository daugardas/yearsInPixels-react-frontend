import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import injectSheet from 'react-jss';

import Footer from './components/Footer';
import Logout from './components/Logout';
import Nav from './components/Nav';
import User from './components/User';
import Pixels from './components/Pixels';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import ForgotPassword from './components/ForgotPassword';
import Reset from './components/Reset';
import Loader from './components/Loader';
import BackgroundCanvas from './components/BackgroundCanvas';
import Notifications from './components/Notifications';

const styles = {}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: undefined,
      userCreated: undefined,
      userEmail: undefined,
      loading: false,
    };
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this);
    this.removeNotifications = this.removeNotifications.bind(this);
    this.createNotification = this.createNotification.bind(this);
    this.resizeBackground = this.resizeBackground.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.updateUserStates = this.updateUserStates.bind(this);
    this.resizeLineSpace = this.resizeLineSpace.bind(this);
    this.messages = [];
  }
  render() {
    const { classes } = this.props;
    const routes = this.state.loggedIn ? (
      <Switch>
        <Route exact path='/login' render={() => <Redirect to='/pixels' />} />
        <Route exact path='/register' render={() => <Redirect to='/pixels' />} />
        <Route exact path='/profile' render={() => {
          return <User
            username={this.state.username}
            userCreated={this.state.userCreated}
            userEmail={this.state.userEmail}
            removeNotifications={this.removeNotifications}
            createNotification={this.createNotification}
            resizeBackground={this.resizeBackground}
            setLoading={this.setLoading}
            updateStates={this.updateUserStates}
            removeAccInfo={this.logOut}
            resizeLineSpace={this.resizeLineSpace} />
        }} />
        <Route path="/logout" render={() => {
          return <Logout
            logOut={this.logOut}
            removeNotifications={this.removeNotifications}
            createNotification={this.createNotification}
            resizeBackground={this.resizeBackground} />
        }} />
        <Route path="/pixels" render={() => {
          return <Pixels
            removeNotifications={this.removeNotifications}
            createNotification={this.createNotification}
            resizeBackground={this.resizeBackground}
          />
        }} />
        <Route exact path="/" render={() => (
          <About
            removeNotifications={this.removeNotifications}
            createNotification={this.createNotification}
            resizeBackground={this.resizeBackground} />
        )} />
        <Route render={() => <Redirect to="/pixels" />} />
      </Switch>
    ) : (
        <Switch>
          <Route exact path='/logout' render={() => <Redirect to="/" />} />
          <Route exact path='/profile' render={() => <Redirect to='/' />} />
          <Route path='/reset/:token' render={({ match }) => (
            <Reset
              token={match.params.token}
              removeNotifications={this.removeNotifications}
              createNotification={this.createNotification}
              resizeBackground={this.resizeBackground} />
          )} />
          <Route path="/forgot" render={() => {
            return <ForgotPassword
              removeNotifications={this.removeNotifications}
              createNotification={this.createNotification}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route path="/login" render={() => {
            return <Login
              login={this.logIn}
              removeNotifications={this.removeNotifications}
              createNotification={this.createNotification}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route path="/register" render={() => {
            return <Register
              setLoading={this.setLoading}
              removeNotifications={this.removeNotifications}
              createNotification={this.createNotification}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route exact path="/" render={() => {
            return <About
              removeNotifications={this.removeNotifications}
              createNotification={this.createNotification}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route render={() => <Redirect to='/' />} />
        </Switch>
      );
    const appBody = this.state.loading ? <Loader /> : routes;
    return (
      <div id="App">
        <Notifications innerRef={(ref) => this.notifications = ref} />
        <BackgroundCanvas innerRef={(ref) => this.backgroundCanvas = ref} />
        <Nav username={this.state.username} logged={this.state.loggedIn} />
        {appBody}
        <Footer />
      </div>
    );
  }
  logOut() {
    this.setState({
      loggedIn: false,
      username: undefined,
      userCreated: undefined,
      userEmail: undefined,
      userMoods: undefined
    });
    document.cookie = "token=;"
  }
  logIn() {
    this.setState({
      loggedIn: true,
      // eslint-disable-next-line
      username: document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
      // eslint-disable-next-line
      userCreated: document.cookie.replace(/(?:(?:^|.*;\s*)userCreated\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
      // eslint-disable-next-line
      userEmail: document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    });
  }
  setLoading() {
    this.setState({ loading: !this.state.loading, });
  }
  updateUserStates() {
    this.setState({
      // eslint-disable-next-line
      username: document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
      // eslint-disable-next-line
      userCreated: document.cookie.replace(/(?:(?:^|.*;\s*)userCreated\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
      // eslint-disable-next-line
      userEmail: document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    });
  }
  componentWillMount() {
    // eslint-disable-next-line
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      this.setState({ loading: true });
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('GET', `https://api.yearsinpixels.com/api/user`, true);
      httpRequest.setRequestHeader("x-access-token", `${token}`);
      httpRequest.send();
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              let response = JSON.parse(httpRequest.responseText);
              if (!response.error) {
                this.setState({
                  loggedIn: true,
                  loading: false,
                  username: response.username,
                  userEmail: response.email,
                  userCreated: response.dateCreated,
                });
              } else {
                let response = JSON.parse(httpRequest.responseText);
                this.messages.push({ text: response.error, type: "error" })

              }
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => this.messages.push({ text: err, type: "error" }));
              } else {
                this.messages.push({ text: response.message, type: "error" })
              }

            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.messages.push({ text: e, type: "error" });
        }
      }
    }
  }
  removeNotifications() {
    this.notifications.removeNotifications();
  }
  resizeBackground() {
    this.backgroundCanvas.resize();
  }
  resizeLineSpace(value) {
    this.backgroundCanvas.lineSpace = value;
    this.backgroundCanvas.resize();
  }
  createNotification(type, content) {
    this.notifications.newNotification(type, content);
  }
}
export default injectSheet(styles)(App);