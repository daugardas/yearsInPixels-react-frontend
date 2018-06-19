import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css'

export class Nav extends Component {
  render() {
    const userNav = this.props.logged ? (
      <nav>
        <NavLink activeClassName="nav-active" to='/profile' className="nav-item">{this.props.username}</NavLink>
        <NavLink activeClassName="nav-active" to="/pixels" className="nav-item">Pixels</NavLink>
        <NavLink exact activeClassName="nav-active" to="/" className="nav-item">About</NavLink>
        <NavLink activeClassName="nav-active" to="/logout" className="nav-item">Log out</NavLink>
      </nav>
    ) : (
        <nav>
          <NavLink activeClassName="nav-active" to="/login" className="nav-item">Login</NavLink>
          <NavLink activeClassName="nav-active" to="/register" className="nav-item">Register</NavLink>
          <NavLink exact activeClassName="nav-active" to="/" className="nav-item">About</NavLink>
        </nav>
      );
    return (
      <nav className="nav-wrapper">{userNav.props.children}</nav>
    );
  }
}