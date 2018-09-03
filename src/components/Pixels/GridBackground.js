import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  background: {
    position: 'absolute',
    zIndex: -1
  }
};

class Background extends Component {
  constructor(props) {
    super(props);
    this.lineSpace = props.size;
  }
  render() {
    const { classes } = this.props;
    return <canvas id="gridBackground" className={classes.background}></canvas>;
  }
  drawBackgroundLines = () => {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#e5f5ff";
    for (let i = 0; i < this.xLinesCount; i++) {
      this.ctx.moveTo(this.lineSpace * (i + 1), 0);
      this.ctx.lineTo(this.lineSpace * (i + 1), this.canvas.height);
      this.ctx.stroke();
    }
    for (let i = 0; i < this.yLinesCount; i++) {
      this.ctx.moveTo(0, this.lineSpace * (i + 1));
      this.ctx.lineTo(this.canvas.width, this.lineSpace * (i + 1));
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }
  componentDidMount() {
    this.canvas = document.getElementById("gridBackground");
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 13 * this.lineSpace;
    this.canvas.height = 32 * this.lineSpace;
    this.xLinesCount = Math.floor(this.canvas.width / this.lineSpace) - 1;
    this.yLinesCount = Math.floor(this.canvas.height / this.lineSpace) - 1;
    this.drawBackgroundLines();
  }
  componentWillReceiveProps(props) {
    if (this.props.size !== props.size) {
      this.lineSpace = props.size;
      this.canvas.width = 13 * this.lineSpace;
      this.canvas.height = 32 * this.lineSpace;
      this.xLinesCount = Math.floor(this.canvas.width / this.lineSpace);
      this.yLinesCount = Math.floor(this.canvas.height / this.lineSpace);
      this.drawBackgroundLines();
    }
  }
}

export default injectSheet(styles)(Background);