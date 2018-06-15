import React, { Component } from 'react';
import Loader from './Loader';
export class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.forgot = this.forgot.bind(this);
  }
  render() {
    const form = this.state.loading ? <Loader /> : (
      <form method="post">
        <div className="input-wrap">
          <input required id="user-or-email" className="input" name="user-or-email" type="text" placeholder="Enter your email or username" />
        </div>
        <button type="submit" onClick={this.forgot} className="submit-button">Submit</button>
      </form>
    );
    return (
      <div className="form-wrapper">
        {form}
      </div>
    );
  }
  forgot(e) {
    e.preventDefault();
    this.setState({loading: true});
    document.getElementById('messages').innerHTML = "";
    let input = document.getElementById('user-or-email').value;
    let makeRequest = true;
    let req = {};
    // check email if it's an email
    let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(input)) {
      req.email = input;
    } else if(input === "") {
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
              this.props.messages.push({text: response.message, type: "message"});
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => this.props.messages.push({ text: err, type: "error" }));
              } else if(response.hasOwnProperty('error')){
                this.props.messages.push({ text: response.error, type: "error"})
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