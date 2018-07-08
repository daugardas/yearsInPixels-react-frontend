import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  input: {
    fontFamily: 'Indie Flower, cursive',
    float: 'right',
    fontSize: 22,
    marginLeft: 20,
    background: '#f3fbff',
    width: 290,
    borderRadius: 25,
    border: '1px solid #d8efff',
    padding: '5px 10px 5px 15px',
    lineHeight: '35px',
    caretColor: '#a1d2ff',
    transition: 'box-shadow 0.5s ease',
    '&:focus': {
      boxShadow: '0px 0px 0px 2px #a9dbff'
    }
  }
}

class EmailInput extends Component {
  render(){
    const { classes, value } = this.props;
    return <input required className={classes.input} type="email" value={value} onChange={this.handleChange.bind(this)} />
  }
  handleChange(e){
    const { onChange } = this.props;
    onChange(e.target.value);
  }
}

export default injectSheet(styles)(EmailInput);