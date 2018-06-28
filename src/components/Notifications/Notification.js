import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: '10px 50px',
    width: 250,
    minHeight: 40,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  error: {
    background: `#ff7e7e`
  },
  success: {
    background: `#83ff83`
  },
};

class Notification extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id
    };
  }
  render() {
    const { classes, children, notificationType } = this.props;
    return <div className={`${classes.container} ${classes[notificationType]}`} onClick={this.handleClick.bind(this)}>{children}</div>
  }
  handleClick(){
    this.props.removeNotification(this.state.id);
  }
}

export default injectSheet(styles)(Notification);