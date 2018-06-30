import React, { Component } from 'react';
import injectSheet from 'react-jss';

import DesktopNav from './Nav/DesktopNav';
import MobileNav from './Nav/MobileNav';
import NavBars from './Nav/NavBars';

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
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      displayMobileNav: false
    }
  }
  render() {
    const { width, displayMobileNav } = this.state;
    const { classes, logged, username } = this.props;
    return (
      <nav className={classes.container}>
        <NavBars onClick={this.displayNav.bind(this)} />
        {width < 1024 ? <MobileNav display={displayMobileNav} logged={logged} width={width} username={username}/> : <DesktopNav logged={logged} username={username} />}
      </nav>
    );
  }
  displayNav() {
    this.setState(prevState => ({ displayMobileNav: !prevState.displayMobileNav }))
  }
  componentDidMount() {
    window.addEventListener('resize', () => this.setState({ width: window.innerWidth }));
  }
}

export default injectSheet(styles)(Nav);