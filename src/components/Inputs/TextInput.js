import React, { Component } from 'react';

class TextInput extends Component {
  render(){
    const { value, required } = this.props;
    return <div><input required={required} type="text" value={value} onChange={this.handleChange.bind(this)} /></div>
  }
  handleChange(e){
    const { onChange } = this.props;
    onChange(e.target.value);
  }
}

export default TextInput;