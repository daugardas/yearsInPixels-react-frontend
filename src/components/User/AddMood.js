import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { createMood } from '../../actions/UserActions';

const styles = {
  container: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `flex-start`,
    marginTop: `20px`
  },
  nameInput: {
    width: `200px !important`,
    justifySelf: `flex-start !important`,
    alignSelf: `flex-start !important`,
    margin: `0 10px 0 0 !important`,
    fontFamily: `'Indie Flower', cursive`,
    float: `right`,
    fontSize: `22px`,
    marginLeft: `20px`,
    background: `#f3fbff`,
    borderRadius: `25px`,
    border: `1px solid #d8efff`,
    padding: `5px 10px 5px 15px`,
    lineHeight: `35px`,
    caretColor: `#a1d2ff`,
    transition: `box-shadow 0.5s ease`,
    '&:focus': {
      boxShadow: `0px 0px 0px 2px #a9dbff`
    }
  },
  colorInput: {
    marginLeft: `auto`,
    width: `30px`,
    height: `30px`,
    '&:hover': {
      cursor: `pointer`
    }
  },
  button: {
    padding: `0 4px`,
    marginLeft: `30px`,
    backgroundColor: `#73E673`,
    fontSize: `25px`,
    border: `2px solid #66CC66`,
    borderRadius: `30px`,
    transition: `font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease`
  }
};

class AddMood extends Component {
  state = {
    name: '',
    color: '#000000'
  }
  render() {
    const { classes } = this.props;
    const { name, color } = this.state;
    return (
      <div className={classes.container}>
        <input type="text" className={classes.nameInput} value={name} onChange={this.handleNameChange.bind(this)} placeholder="Enter pixel name" />
        <input type="color" className={classes.colorInput} value={color} onChange={this.handleColorChange.bind(this)} />
        <button type="submit" className={classes.button} onClick={this.createMood.bind(this)}>Add</button>
      </div>
    );
  }
  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }
  handleColorChange(e) {
    this.setState({ color: e.target.value })
  }
  createMood() {
    const { name, color } = this.state;
    createMood(name, color);
    this.setState({ name: '', color: '' });
  }
}

export default injectSheet(styles)(AddMood);