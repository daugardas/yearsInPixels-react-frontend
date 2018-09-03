import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  inputPass: {
    borderTopRightRadius: [0, '!important'],
    borderBottomRightRadius: [0, '!important'],
  },
  hiddenFontSize: {
    fontSize: [18, '!important']
  },
  shownFontSize: {
    fontSize: 22
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(-2px)',
    borderTopLeftRadius: [0, '!important'],
    borderBottomLeftRadius: [0, '!important'],
    '& i': {
      cursor: 'pointer',
      margin: '0 10px',
      color: '#83a2c7',
      transition: 'color 0.2s ease',
    },
    '& i:hover': {
      color: '#00060e'
    }
  }
};

class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    }
  }
  render() {
    const { hidden } = this.state;
    const { classes, value, required } = this.props;
    return (
      <div>
        <input required={required} className={`${classes.inputPass} ${hidden ? classes.hiddenFontSize : classes.shownFontSize}`} type={hidden ? 'password' : 'text'} value={value} onChange={this.handleChange.bind(this)} />
        <div className={classes.iconContainer}>
          <i className={`fas ${hidden ? 'fa-eye-slash' : 'fa-eye'} hide`} onClick={this.handleVisibility.bind(this)}></i>
        </div>
      </div>
    );
  }
  handleChange(e) {
    const { onChange } = this.props;
    onChange(e.target.value);
  }
  handleVisibility() {
    this.setState({ hidden: !this.state.hidden });
  }
}

export default injectSheet(styles)(PasswordInput);