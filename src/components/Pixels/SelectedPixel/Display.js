import React, { Component } from 'react';
import injectSheet from 'react-jss';
import Journal from './Journal';
import FeltMoods from './FeltMoods';

const styles = {};

class Display extends Component {
  render() {
    const { selectedPixel } = this.props;
    const { moods, journal } = selectedPixel;
    // return <div>
    //   <FeltMoods moods={moods} />
    //   <Journal journal={journal} />
    // </div>

    return [<FeltMoods moods={moods} />, <Journal journal={journal} />]
  }
}

export default injectSheet(styles)(Display);