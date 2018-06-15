import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Logout.css';

export class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
    this.handleRedirect = this.handleRedirect.bind(this);
  }
  redirect() {
    if (this.state.redirect) {
      return <Redirect to='/yearly' />
    }
  }
  handleRedirect() {
    this.setState({ redirect: true });
  }
  render() {
    return (
      <div id="logout-wrapper" className="logout-wrapper">
        <div className="logout-label">Are you sure you want to log out?</div>
        <div className="buttons">
          {this.redirect()}
          <button type="button" onClick={this.props.logOut} className="logout-button logout-confirm">Log out</button>
          <button type="button" onClick={this.handleRedirect} className="logout-button logout-cancel">Cancel</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.props.removeMessages();
    this.props.resizeBackground();
  }
}