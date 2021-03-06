import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import injectSheet from 'react-jss';

const styles = {
  links: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly'
  },
  link: {
    width: `fit-content`,
    height: `60px`,
    display: `flex`,
    flexShrink: `1`,
    alignItems: `flex-end`,
    justifyContent: `center`,
    textDecoration: `none`,
    fontSize: ` 45px`,
    transition: `transform 0.25s ease, font-weight 0.2s`,
    color: `#7c95a0`,
    '&:hover': {
      fontWeight: `700`,
      transform: `scale(1.08)`,
      cursor: `pointer`
    }
  },
  activeLink: {
    color: `#4b5b66`
  },
};

class DesktopNav extends Component {
  render() {
    const { classes } = this.props;
    const links = this.props.logged ? (
      <div>
        <NavLink activeClassName={classes.activeLink} to='/profile' className={classes.link}>{this.props.username}</NavLink>
        <NavLink activeClassName={classes.activeLink} to="/pixels" className={classes.link}>Pixels</NavLink>
        <NavLink exact activeClassName={classes.activeLink} to="/" className={classes.link}>About</NavLink>
        <NavLink activeClassName={classes.activeLink} to="/logout" className={classes.link}>Log out</NavLink>
      </div>
    ) : (
        <div>
          <NavLink activeClassName={classes.activeLink} to="/login" className={classes.link}>Login</NavLink>
          <NavLink activeClassName={classes.activeLink} to="/register" className={classes.link}>Register</NavLink>
          <NavLink exact activeClassName={classes.activeLink} to="/" className={classes.link}>About</NavLink>
        </div>
      );
    return <div className={classes.links}>{links.props.children}</div>
  }
}

export default injectSheet(styles)(DesktopNav);