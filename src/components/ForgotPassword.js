import React, { Component } from 'react';
import injectSheet from 'react-jss';

import Loader from './Loader';

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
  },
  inputContainer: {
    width: `auto`,
    margin: `12px 0`,
    '& label': {
      fontSize: `35px`,
      color: `#364d6b`
    }
  },
  input: {
    fontFamily: `'Indie Flower', cursive`,
    float: `right`,
    fontSize: `22px`,
    marginLeft: `20px`,
    background: `#f3fbff`,
    width: `290px`,
    borderRadius: `25px`,
    border: `1px solid #d8efff`,
    padding: `5px 10px 5px 15px`,
    lineHeight: `35px`,
    caretColor: `#a1d2ff`,
    transition: `box-shadow 0.5s ease`,
    '&:focus': {
      boxShadow: `0px 0px 0px 2px #a9dbff`
    }
  },
  button: {
    padding: `10px`,
    width: `130px`,
    backgroundColor: `#eef9ff`,
    fontSize: `25px`,
    margin: `0 10px`,
    border: `5px solid #dbf0ff`,
    borderRadius: `30px`,
    transition: `font - weight 0.3s ease, transform 0.3s ease, color 0.3s ease`,
    alignSelf: `center`,
    '&:hover': {
      fontWeight: `700`,
      cursor: `pointer`,
      transform: `scale(1.02)`
    }
  }
};

export class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.forgot = this.forgot.bind(this);
  }
  render() {
    console.log(this.props)
    const { classes } = this.props;
    const form = this.state.loading ? <Loader /> : (
      <form method="post">
        <div className={classes.inputContainer}>
          <input required id="user-or-email" className={classes.input} name="user-or-email" type="text" placeholder="Enter your email or username" />
        </div>
        <button type="submit" onClick={this.forgot} className={classes.button}>Submit</button>
      </form>
    );
    return (
      <div className={classes.container}>
        {form}
      </div>
    );
  }
  forgot(e) {
    e.preventDefault();
    this.setState({ loading: true });
    document.getElementById('messages').innerHTML = "";
    let input = document.getElementById('user-or-email').value;
    let makeRequest = true;
    let req = {};
    // check email if it's an email
    let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(input)) {
      req.email = input;
    } else if (input === "") {
      makeRequest = false;
    } else {
      req.username = input;
    }
    if (makeRequest) {
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', `https://api.yearsinpixels.com/api/forgot`, true);
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.send(JSON.stringify(req));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              let response = JSON.parse(httpRequest.responseText);
              this.props.messages.push({ text: response.message, type: "message" });
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => this.props.messages.push({ text: err, type: "error" }));
              } else if (response.hasOwnProperty('error')) {
                this.props.messages.push({ text: response.error, type: "error" })
              } else {
                this.props.messages.push({ text: response.message, type: "error" })
              }
            }
            this.setState({ loading: false });
            this.props.renderMessages();
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.setState({ loading: false });
          this.props.renderMessages();
        }
      }
    } else {
      this.setState({ loading: false });
      this.props.renderMessages();
    }
  }
  componentDidMount() {
    this.props.removeMessages();
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(ForgotPassword);