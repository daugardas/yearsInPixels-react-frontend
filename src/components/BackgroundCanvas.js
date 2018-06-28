import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  canvas: {
    position: `absolute`,
    top: `0`,
    left: `0`,
    zIndex: `-100`
  }
};

class BackgroundCanvas extends Component {
  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
    this.drawPixelsDates = this.drawPixelsDates.bind(this);
    this.lineSpace = 30;
  }
  render() {
    const { classes } = this.props;
    return (
      <canvas id="notebookCanvas" className={classes.canvas}></canvas>
    );
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
    this.canvas = document.getElementById("notebookCanvas");
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight > document.documentElement.scrollHeight ? window.innerHeight : document.documentElement.scrollHeight;
    this.xLinesCount = Math.floor(this.canvas.width / this.lineSpace);
    this.yLinesCount = Math.floor(this.canvas.height / this.lineSpace);
    /* this.drawPixelsDates(); */
    this.drawBackgroundLines();
    window.onresize = () => {
      this.resize();
    };

  }
  resize() {
    this.canvas.width = "";
    this.canvas.height = "";
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight > document.documentElement.scrollHeight ? window.innerHeight : document.documentElement.scrollHeight;
    this.xLinesCount = Math.floor(this.canvas.width / this.lineSpace);
    this.yLinesCount = Math.floor(this.canvas.height / this.lineSpace);
    /* this.drawPixelsDates(); */
    this.drawBackgroundLines();

  }
  drawPixelsDates() {
    this.ctx.fillStyle = 'green';
    let x = this.xLinesCount / 2 * this.lineSpace;
    let y = this.yLinesCount / 2 * this.lineSpace;;
    this.ctx.fillRect(x, y, this.lineSpace, this.lineSpace);
  }
}

export default injectSheet(styles)(BackgroundCanvas);