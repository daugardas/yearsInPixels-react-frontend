import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'inline',
    width: 317.2
  },
  inputPass: {
    fontFamily: `Indie Flower, cursive`,
    float: `right`,
    marginLeft: `20px`,
    background: `#f3fbff`,
    borderRadius: `25px`,
    border: ` 1px solid #d8efff`,
    padding: ` 5px 10px 5px 15px`,
    lineHeight: `35px`,
    borderTopRightRadius: `0`,
    borderBottomRightRadius: `0`,
    width: `249px`,
    caretColor: `#a1d2ff`,
    transition: `box-shadow 0.5s ease`,
    '&:focus': {
      boxShadow: `0px 0px 0px 2px #a9dbff`
    }
  },
  hiddenFontSize: {
    fontSize: 16
  },
  shownFontSize: {
    fontSize: 22
  },
  iconContainer: {
    display: `flex`,
    float: `right`,
    width: `40px`,
    height: `45.5px`,
    background: `#f3fbff`,
    alignItems: `center`,
    justifyContent: `center`,
    border: `1px solid #d8efff`,
    borderRadius: `25px`,
    borderTopLeftRadius: `0`,
    borderBottomLeftRadius: `0`,
    '& i': {
      cursor: `pointer`,
      margin: `0 10px`,
      color: `#83a2c7`,
      transition: `color 0.2s ease`,
    },
    '& i:hover': {
      color: `#00060e`
    }
  }
};

class PasswordInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      hidden: true
    }
  }
  render() {
    const { hidden } = this.state;
    const { classes, value } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.iconContainer}>
          { hidden ? <i className="fas fa-eye-slash hide" onClick={this.handleVisibility.bind(this)}></i>: <i className="fas fa-eye hide" onClick={this.handleVisibility.bind(this)}></i>} 
        </div>
        <input required className={`${classes.inputPass} ${hidden ? classes.hiddenFontSize:classes.shownFontSize}`} type={ hidden ? 'password':'text'} value={value} onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
  handleChange(e){
    const { onChange } = this.props;
    onChange(e.target.value);
  }
  handleVisibility(){
    this.setState({ hidden: !this.state.hidden});
  }
}

export default injectSheet(styles)(PasswordInput);