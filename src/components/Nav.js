import React, { Component } from 'react';
import injectSheet from 'react-jss';

import DesktopNav from './Nav/DesktopNav';
import MobileNav from './Nav/MobileNav';
import NavBars from './Nav/NavBars';

import { connect } from 'react-redux';
import { linkClick, displayChange } from '../actions/mobileNavActions';

const styles = {
  container: {
    display: `flex`,
    width: `100%`,
    flexDirection: 'column',
    zIndex: 9999
  },
  '@media (max-width: 1024px)': {
    container: {
      position: 'fixed',
      top: 0,
      background: '#f3fbff',
      boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.1)'
    },
  }
};

class Nav extends Component {
  render() {
    const { classes, logged, username, displayMobileNav, width } = this.props;
    return (
      <nav className={classes.container}>
        <NavBars onClick={displayChange} clicked={displayMobileNav} width={width} />
        {width < 1024 ? <MobileNav display={displayMobileNav} logged={logged} width={width} username={username} onLinkClick={linkClick} /> : <DesktopNav logged={logged} username={username} />}
      </nav>
    );
  }
}

function mapStateToProps(state) {
  const { displayMobileNav } = state;
  return { displayMobileNav };
}

export default connect(mapStateToProps)(injectSheet(styles)(Nav));