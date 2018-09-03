import React, { Component } from 'react';
import injectSheet from 'react-jss';

import Tooltip from '../../Tooltip';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '999',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  icon: {
    marginLeft: 12,
    fontSize: 22,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  editIcon: {
    color: '#E6E62E',
    '&:hover': {
      color: '#D9D92B',
    }
  },
  removeIcon: {
    color: '#cc2828',
    '&:hover': {
      color: '#991e1e',
    }
  },
  removeCounter: {
    position: 'absolute',
    right: -30,
    fontSize: 45,
    fontWeight: 'bold',
  }
};

class Buttons extends Component {
  state = {
    removeCounter: 3,
    removeCounterStyle: {
      visibility: 'hidden'
    }
  }
  render() {
    const { classes, display, onEdit } = this.props;
    const { removeCounter, removeCounterStyle } = this.state;


    return display ? (
      <div className={classes.container}>

        <i className={`fas fa-edit ${classes.icon} ${classes.editIcon}`} onClick={onEdit}></i>
        {/* <Tooltip tip='Hold for 3 sec' hide={removeCounterStyle.visibility !== 'hidden'}>
          <i className={`fas fa-trash-alt ${classes.icon} ${classes.removeIcon}`} onMouseDown={this.startCountDown.bind(this)} onMouseUp={this.cancelCountDown.bind(this)}></i>
        </Tooltip> */}
        <Tooltip tip={`${removeCounterStyle.visibility !== 'hidden' ? removeCounter : 'Hold for 3 sec'}`} hide={false}>
          <i className={`fas fa-trash-alt ${classes.icon} ${classes.removeIcon}`} onMouseDown={this.startCountDown.bind(this)} onMouseUp={this.cancelCountDown.bind(this)}></i>
        </Tooltip>

        {/* <div className={classes.removeCounter} style={removeCounterStyle}>{removeCounter}</div> */}
      </div>
    ) : null;
  }
  startCountDown() {
    const { onRemove } = this.props;

    this.setState({
      removeCounterStyle: {
        color: '#29CC29',
        visibility: 'visible'
      }
    });

    this.removeInterval = setInterval(() => {
      const { removeCounter } = this.state;

      switch (removeCounter) {
        case 3:
          this.setState({
            removeCounter: 2,
            removeCounterStyle: { color: '#29CC29' }
          });
          break;
        case 2:
          this.setState({
            removeCounter: 1,
            removeCounterStyle: { color: '#E6E62E' }
          });
          break;
        case 1:
          this.setState({
            removeCounter: 0,
            removeCounterStyle: { color: '#E62E2E' }
          });
          onRemove();
          break;
        default:
          this.cancelCountDown();
      }
    }, 1000);
  }
  cancelCountDown() {
    clearInterval(this.removeInterval);
    this.setState({
      removeCounter: 3,
      removeCounterStyle: {
        visibility: 'hidden'
      }
    });
  }
}

export default injectSheet(styles)(Buttons);