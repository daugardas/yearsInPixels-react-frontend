import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    width: `28px`,
    height: `28px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  hoverBorder: {
    width: `24px`,
    height: `24px`,
    '&:hover': {
      border: `2px solid #363636`,
      cursor: `pointer`
    }
  },
  blockEdit: {
    cursor: `not-allowed !important`,
    '&:hover': {
      cursor: `not-allowed !important`
    }
  }
};

class Day extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moodDayID: null,
      moods: null,
      journal: "",
      background: `transparent`,
      allowEdit: false
    }
    this.handleEditClick = this.handleEditClick.bind(this);
  }
  render() {
    const { classes } = this.props;
    let dayStyles = {
      background: this.state.background
    };
    return (
      <div className={classes.container} style={dayStyles} onClick={this.handleEditClick}>
        <div className={`${classes.hoverBorder} ${!this.state.allowEdit ? classes.blockEdit : ''}`} ></div>
      </div>
    );
  }
  componentWillMount() {
    const { pixelMoods, userMoods } = this.props;
    const todayTime = new Date().setHours(0, 0, 0, 0);

    this.setState({
      allowEdit: todayTime >= this.props.date ? true : false
    });

    if (pixelMoods !== undefined) {
      this.setState({
        moodDayID: pixelMoods.id,
        moods: pixelMoods.dayMoods,
        journal: pixelMoods.journal === null ? "" : pixelMoods.journal
      });

      // if this component day equals to todays date
      // then call editPixel() to show already set moods
      if (this.props.date === todayTime) {
        let journal = pixelMoods.journal === null ? "" : pixelMoods.journal;
        this.props.editPixel(pixelMoods.id, pixelMoods.dayMoods, journal, this.props.date);
      }

      // generate background for the day component
      const moods = pixelMoods.dayMoods;
      let colors = ``;
      let colorsCounter = 0;
      let previousPercentage;
      for (let i = 0; i < userMoods.length; i++) {
        let userMood = userMoods[i];
        for (let j = 0; j < moods.length; j++) {
          let mood = moods[j];
          if (mood.moodId.toString() === userMood.moodID.toString()) {
            if (colorsCounter === 0) {
              colors += `${userMood.moodColor},${userMood.moodColor} ${mood.percentage}%`;
              previousPercentage = mood.percentage;
              colorsCounter++;
            } else {
              colors += `, ${userMood.moodColor} ${previousPercentage}%,${userMood.moodColor} ${previousPercentage + mood.percentage}%`;
              previousPercentage += mood.percentage;
            }
            this.setState({
              background: `linear-gradient(135deg, ${colors})`
            });
          }
        }
      }
    }
  }
  handleEditClick() {
    if (this.state.allowEdit) {
      this.props.editPixel(this.state.moodDayID, this.state.moods, this.state.journal, this.props.date);
    }
  }
}

export default injectSheet(styles)(Day);