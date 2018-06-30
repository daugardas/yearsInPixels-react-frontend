import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {

  }
};

class NavBars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    }
    this.handleClick = this.handleClick.bind(this);
  }
  render() {
    const { clicked } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container} onClick={this.handleClick}>
        {clicked ? <i className={`fas fa-times`}></i> : <i className={`"fas fa-bars`}></i>}
      </div>
    );
  }
  handleClick(){
    this.setState(prevState => ({clicked: !prevState.clicked}));
  }
}

export default injectSheet(styles)(NavBars);