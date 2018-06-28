import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import injectSheet from 'react-jss';

//import './App.css';
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

const styles = {
  messages: {
    display: `flex`,
    width: `500px`,
    flexDirection: `column-reverse`,
    alignItems: `center`,
    justifyContent: `center`,
    position: `fixed`,
    left: `50%`,
    transform: `translateX(-50%)`,
    bottom: `0`,
    zIndex: `999`,
    marginTop: `17px`
  },
  message: { 
    fontSize: `22px`,
    fontWeight: `bold`,
    padding: `10px 50px`,
    width: `100%`
  },
  error: {
    background: `#ff7e7e`
  },
  success: {
    background: `#83ff83`
  },
  '@keyframes fade-out': {
    from: {opacity: 1},
    to: {opacity: 0}
  }
}

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
    this.removeMessages = this.removeMessages.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
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
            messages={this.messages}
            removeMessages={this.removeMessages}
            resizeBackground={this.resizeBackground}
            setLoading={this.setLoading}
            renderMessages={this.renderMessages}
            updateStates={this.updateUserStates}
            removeAccInfo={this.logOut}
            resizeLineSpace={this.resizeLineSpace} />
        }} />
        <Route path="/logout" render={() => {
          return <Logout
            logOut={this.logOut}
            messages={this.messages}
            renderMessages={this.renderMessages}
            removeMessages={this.removeMessages}
            resizeBackground={this.resizeBackground} />
        }} />
        <Route path="/pixels" render={() => {
          return <Pixels
            messages={this.messages}
            renderMessages={this.renderMessages}
            removeMessages={this.removeMessages}
            resizeBackground={this.resizeBackground}
          />
        }} />
        <Route exact path="/" render={() => (
          <About
            messages={this.messages}
            renderMessages={this.renderMessages}
            removeMessages={this.removeMessages}
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
              messages={this.messages}
              renderMessages={this.renderMessages}
              token={match.params.token}
              removeMessages={this.removeMessages}
              resizeBackground={this.resizeBackground} />
          )} />
          <Route path="/forgot" render={() => {
            return <ForgotPassword
              messages={this.messages}
              renderMessages={this.renderMessages}
              removeMessages={this.removeMessages}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route path="/login" render={() => {
            return <Login
              messages={this.messages}
              renderMessages={this.renderMessages}
              login={this.logIn}
              removeMessages={this.removeMessages}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route path="/register" render={() => {
            return <Register
              messages={this.messages}
              renderMessages={this.renderMessages}
              setLoading={this.setLoading}
              removeMessages={this.removeMessages}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route exact path="/" render={() => {
            return <About
              messages={this.messages}
              renderMessages={this.renderMessages}
              removeMessages={this.removeMessages}
              resizeBackground={this.resizeBackground} />
          }} />
          <Route render={() => <Redirect to='/' />} />
        </Switch>
      );
    const appBody = this.state.loading ? <Loader /> : routes;
    return (
      <div id="App">
        <BackgroundCanvas innerRef={(ref) => this.backgroundCanvas = ref} />
        <Nav username={this.state.username} logged={this.state.loggedIn} />
        {appBody}
        <div id="messages" className={classes.messages}></div>
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
                this.renderMessages();
              }
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => this.messages.push({ text: err, type: "error" }));
              } else {
                this.messages.push({ text: response.message, type: "error" })
              }
              this.renderMessages();
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.messages.push({ text: e, type: "error" });
          this.renderMessages();
        }
      }
    }
  }
  renderMessages() {
    const {classes} = this.props;
    let messagesEl = document.getElementById('messages');
    for (let i = 0; i < this.messages.length; i++) {
      let message = document.createElement("div");
      message.classList.add(classes.message);
      message.innerHTML = this.messages[i].text;
      if (this.messages[i].type === "error") {
        message.classList.add(classes.error);
      } else {
        message.classList.add(classes.success);
      }
      messagesEl.appendChild(message);
    }
    this.messages = [];
    this.setState({ loading: false });
  }
  removeMessages = async function () {
    function pauseFade() {
      return new Promise(resolve => {
        setTimeout(() => { resolve(true) }, 700)
      });
    }
    let messagesChildren = document.getElementById('messages').children;
    let counter = messagesChildren.length;
    if (counter > 0) {
      counter--;
      for (let i = counter; i >= 0; i--) {
        let message = messagesChildren.item(i);
        message.style.animation = `fade-out 3000ms`;
        setTimeout(() => {
          try {
            document.getElementById('messages').removeChild(message);
          } catch (error) {
            if (error.code === 8) {
              // message already deleted, probably by another component, so do nothing
            } else {
              // something new
              this.messages.push({ text: `Err code ${error.code} | Err name: ${error.name} message: ${error.message}`, type: "error" });
            }
          }
        }, 3000);
        await pauseFade();
      }
    }
  }
  resizeBackground() {
    this.backgroundCanvas.resize();
  }
  resizeLineSpace(value) {
    this.backgroundCanvas.lineSpace = value;
    this.backgroundCanvas.resize();
  }
}
export default injectSheet(styles)(App);