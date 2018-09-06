import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import injectSheet from 'react-jss';

const styles = {
  links: {
    display: 'flex',
    width: '100%',
    transition: 'height 120ms ease-in',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    overflow: 'hidden'
  },
  link: {
    width: '100%',
    height: 45,
    display: 'flex',
    flexShrink: '1',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textDecoration: 'none',
    fontSize: 35,
    transition: 'transform 0.25s ease, font-weight 0.2s',
    padding: [[15, 0]],
    color: '#7c95a0',
    '&:hover': {
      fontWeight: '700',
      transform: 'scale(1.08)',
      cursor: 'pointer'
    },
    '&:not(:last-child)': {
      borderBottom: '2px solid #d8efff'
    }
  },
  activeLink: {
    color: '#4b5b66'
  },
  closed: {
    height: 0
  },
  open: {
    height: 232
  },
  loggedOpen: {
    height: 312
  }
};

class MobileNav extends Component {
  render() {
    const { classes, display, logged, onLinkClick } = this.props;
    const links = logged ? (<div>
      <NavLink activeClassName={classes.activeLink} to='/profile' className={classes.link} onClick={onLinkClick} >{this.props.username}</NavLink>
      <NavLink activeClassName={classes.activeLink} to="/pixels" className={classes.link} onClick={onLinkClick} >Pixels</NavLink>
      <NavLink exact activeClassName={classes.activeLink} to="/" className={classes.link} onClick={onLinkClick} >About</NavLink>
      <NavLink activeClassName={classes.activeLink} to="/logout" className={classes.link} onClick={onLinkClick} >Log out</NavLink>
    </div>) :
      (<div>
        <NavLink activeClassName={classes.activeLink} to="/login" className={classes.link} onClick={onLinkClick} >Login</NavLink>
        <NavLink activeClassName={classes.activeLink} to="/register" className={classes.link} onClick={onLinkClick} >Register</NavLink>
        <NavLink exact activeClassName={classes.activeLink} to="/" className={classes.link} onClick={onLinkClick} >About</NavLink>
      </div>);

    return <div className={`${classes.links} ${display ? logged ? classes.loggedOpen : classes.open : classes.closed}`}>{links.props.children}</div>;
  }
}

export default injectSheet(styles)(MobileNav);