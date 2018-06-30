import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'flex',
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#4b5b66',
    fontSize: 35,
    '& i': {
      marginRight: 40
    },
    '&:hover': {
      cursor: 'pointer'
    }
  }
};

class NavBars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      width: window.innerWidth
    }
    this.handleClick = this.handleClick.bind(this);
  }
  render() {
    const { clicked, width } = this.state;
    const { classes } = this.props;
    const button = (
      <div className={classes.container}>
        {clicked ? <i className={`fas fa-times`} onClick={this.handleClick}></i> : <i className={`fas fa-bars`} onClick={this.handleClick}></i>}
      </div>
    );
    const element = width < 1024 ? button : null;
    return element
  }
  handleClick() {
    this.setState(prevState => ({ clicked: !prevState.clicked }));
    this.props.onClick();
  }
  componentDidMount() {
    window.addEventListener('resize', () => this.setState({ width: window.innerWidth }));
  }
}

export default injectSheet(styles)(NavBars);