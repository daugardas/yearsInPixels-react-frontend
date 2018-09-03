import React, { Component } from 'react';

class EmailInput extends Component {
  render(){
    const { value, required } = this.props;
    return <div><input required={required} type="email" value={value} onChange={this.handleChange.bind(this)} /></div>
  }
  handleChange(e){
    const { onChange } = this.props;
    onChange(e.target.value);
  }
}

export default EmailInput;