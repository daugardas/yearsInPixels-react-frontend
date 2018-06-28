import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Notification from './Notifications/Notification';

const styles = {
  container: {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    position: `fixed`,
    zIndex: `999`,
    top: 0,
    right: 0,
    marginTop: 10
  },
  enter: {
    transform: 'translate(101%,-80%) scale(0)'
  },
  enterActive: {
    transform: 'translate(0,0) scale(1)',
    transition: 'transform 200ms linear'
  },
  exit: {
    transform: 'translate(0,0) scale(1)'
  },
  exitActive: {
    transform: 'translate(101%,-80%) scale(0)',
    transition: 'transform 200ms linear'
  }
}

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };

    this.newNotification = this.newNotification.bind(this);
    this.removeNotifications = this.removeNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    window.newNotification = this.newNotification;
    window.removeNotifications = this.removeNotifications;
  }
  render() {
    const { classes } = this.props;
    const { notifications } = this.state;

    return (
      <TransitionGroup className={classes.container}>
        {notifications.map((notification) => (
          <CSSTransition key={notification.id} timeout={200} classNames={{ appear: classes.enter, appearActive: classes.enterActive, enter: classes.enter, enterActive: classes.enterActive, exit: classes.exit, exitActive: classes.exitActive }} unmountOnExit onExited={this.removeNotification.bind(this, notification.id)}>
            <Notification id={notification.id} notificationType={notification.type} removeNotification={this.removeNotification}>{notification.text}</Notification>
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  }
  newNotification(type, text) {
    // check if there is a notifications with same type and text
    let createNotification = true;
    this.state.notifications.forEach(notification => {
      if (notification.type === type && notification.text === text) {
        createNotification = false;
      }
    });
    if (createNotification) {
      let notifyID = window.crypto.getRandomValues(new Uint32Array(1));
      this.setState(prevState => ({ notifications: [...prevState.notifications, { id: notifyID, type: type, text: text, remove: false }] }));
    }
  }
  removeNotifications() {
    this.setState({
      notifications: []
    });
  }
  removeNotification(id) {
    this.setState(prevState => ({
      notifications: prevState.notifications.filter(notification => notification.id !== id)
    }));
  }
  /* setRemoveFlag(id) {
    this.setState(prevState => ({
      notifications: prevState.notifications.map(notification => notification.id === id ? Object.assign(notification, { remove: true }) : notification)
    }));
  } */
}

export default injectSheet(styles)(Notifications);