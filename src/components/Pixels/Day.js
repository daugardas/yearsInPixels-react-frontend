import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { setSelected } from '../../actions/PixelsActions';

const styles = {
  container: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    width: 24,
    height: 24,
  },
  hoverBorder: {
    '&:hover': {
      border: '2px solid #363636',
      cursor: 'pointer'
    }
  },
  blockEdit: {
    cursor: 'not-allowed !important',
    '&:hover': {
      cursor: 'not-allowed !important'
    }
  },
  today: {
    border: '2px solid #cc2851'
  },
  selected: {
    border: '2px solid #363636',
  }
};

class Day extends Component {
  constructor(props) {
    super(props);
    this.now = new Date().setHours(0, 0, 0, 0);
    this.state = {
      background: 'transparent',
      allowEdit: this.now >= props.date ? true : false,
      selected: false
    }
  }
  render() {
    const { classes, date } = this.props;
    const { background, allowEdit, selected } = this.state;
    return (
      <div className={classes.container} style={{ background: background }} onClick={this.handleEditClick.bind(this)}>
        <div className={`${classes.border} ${classes.hoverBorder} ${selected ? classes.selected: ''} ${this.now === date ? classes.today : ''} ${!allowEdit ? classes.blockEdit : ''}`} ></div>
      </div>
    );
  }
  generateBackground(dayMoods) {
    const { moods } = this.props;
    let colors = ``;
    let colorsCounter = 0;
    let previousPercentage;
    for (let i = 0; i < moods.length; i++) {
      let mood = moods[i];
      for (let j = 0; j < dayMoods.length; j++) {
        let day = dayMoods[j];
        if (day.moodId.toString() === mood.moodID.toString()) {
          if (colorsCounter === 0) {
            colors += `${mood.moodColor},${mood.moodColor} ${+day.percentage}%`;
            previousPercentage = +day.percentage;
            colorsCounter++;
          } else {
            colors += `, ${mood.moodColor} ${previousPercentage}%,${mood.moodColor} ${previousPercentage + +day.percentage}%`;
            previousPercentage += +day.percentage;
          }

        }
      }
    }
    this.setState({
      background: `linear-gradient(135deg, ${colors})`
    });
  }
  removeBackground() {
    this.setState({
      background: 'transparent'
    })
  }
  componentWillReceiveProps(props) {
    const { selected, date, pixel } = props;
    if (selected.date === date) {
      this.setState({ selected: true})
      if (selected.id !== '' || selected.changed) {
        const moods = selected.moods.map(mood => { return { moodId: mood.id, percentage: +mood.percentage } });
        this.generateBackground(moods);
      } else if (pixel) {
        this.generateBackground(pixel.dayMoods);
        const { moods } = props;
        const dayMoods = pixel.dayMoods.map(dayMood => {
          let newDayMood = {};

          for (let i = 0; i < moods.length; i++) {
            const mood = moods[i];
            if (dayMood.moodId === mood.moodID) {
              newDayMood = { id: dayMood.moodId, percentage: dayMood.percentage, color: mood.moodColor, name: mood.moodName };
              break;
            }
          };

          return newDayMood;
        });

        setSelected(date, pixel.id, dayMoods, pixel.journal);
      } else {
        this.removeBackground();
      }

    } else {
      this.setState({ selected: false })
    }
  }

  componentWillMount() {
    const { pixel, date, moods } = this.props;

    if (pixel && date === this.now) {
      const dayMoods = pixel.dayMoods.map(dayMood => {
        let newDayMood = {};
        for (let i = 0; i < moods.length; i++) {
          const mood = moods[i];
          if (dayMood.moodId === mood.moodID) {
            newDayMood = { id: dayMood.moodId, percentage: dayMood.percentage, color: mood.moodColor, name: mood.moodName };
            break;
          }
        }

        return newDayMood;
      });

      setSelected(date, pixel.id, dayMoods, pixel.journal);
    } else if (date === this.now) {
      setSelected(date);
    }

    if (pixel) {
      this.generateBackground(pixel.dayMoods);
    }
  }
  handleEditClick() {
    if (this.state.allowEdit) {
      const { moods, pixel, date } = this.props;
      if (pixel) {
        const dayMoods = pixel.dayMoods.map(dayMood => {
          let newDayMood = {};
          for (let i = 0; i < moods.length; i++) {
            const mood = moods[i];
            if (dayMood.moodId === mood.moodID) {
              newDayMood = { id: dayMood.moodId, percentage: dayMood.percentage, color: mood.moodColor, name: mood.moodName };
              break;
            }
          }

          return newDayMood;
        });

        setSelected(date, pixel.id, dayMoods, pixel.journal);
      } else {
        setSelected(date);
      }
    }
  }
}

export default injectSheet(styles)(Day);