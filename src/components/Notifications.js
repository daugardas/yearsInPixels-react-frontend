import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Notification from './Notifications/Notification';

import store from '../stores';
import { createNotification, deleteNotification, deleteAllNotifications } from '../actions/notificationsActions';

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
    this.newNotification = this.newNotification.bind(this);
    this.removeNotifications = this.removeNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }
  render() {
    const { classes, notes } = this.props;

    return (
      <TransitionGroup className={classes.container}>
        {
          notes.map((notification) => (
            <CSSTransition key={notification.id} timeout={200} classNames={{ appear: classes.enter, appearActive: classes.enterActive, enter: classes.enter, enterActive: classes.enterActive, exit: classes.exit, exitActive: classes.exitActive }} unmountOnExit onExited={this.removeNotification.bind(this, notification.id)}>
              <Notification id={notification.id} notificationType={notification.type} removeNotification={this.removeNotification}>{notification.text}</Notification>
            </CSSTransition>
          ))
        }
      </TransitionGroup>
    );
  }
  newNotification(type, text) {
    store.dispatch(createNotification(type, text));
  }
  removeNotifications() {
    store.dispatch(deleteAllNotifications());
  }
  removeNotification(id) {
    store.dispatch(deleteNotification(id));
  }
}

export default injectSheet(styles)(Notifications);