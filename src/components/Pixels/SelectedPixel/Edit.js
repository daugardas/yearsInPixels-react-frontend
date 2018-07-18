import React, { Component } from 'react';
import injectSheet from 'react-jss';

import SubmitButton from '../../SubmitButton';
import ButtonsContainer from '../../ButtonsContainer';

import { addMood, updateMood, removeMood, setMoodPercentage, journalChange, submit, save, clear } from '../../../actions/PixelsActions';

function calculateOtherPercentages(id, percentage, moods) {
  let input = +percentage;
  let delta = 100 - input;
  let sum = 0;
  let siblings = [];
  const length = moods.length;

  // find siblings and find their sum
  for (let i = 0; i < moods.length; i++) {
    const mood = moods[i];
    if (mood.id !== id) {
      siblings.push(mood);
      sum += +mood.percentage;
    }
  }

  let partial = 0;

  siblings.forEach((sibling, i) => {
    let val = +sibling.percentage;
    let fraction = 0;

    //calculate fraction 
    if (sum <= 0) {
      fraction = 1 / (length - 1);
    } else {
      fraction = val / sum;
    }
    // The last element will correct rounding errors
    if (i >= length) {
      val = 100 - partial;
    } else {
      val = delta * fraction;
      partial += val;
    }

    setMoodPercentage(sibling.id, val);
  });
}

const styles = {
  container: {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    '& span': {
      alignSelf: `center`,
      fontSize: `35px`,
      color: `#364d6b`
    }
  },
  emotionsList: {
    display: `flex`,
    width: `100%`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  editEmotion: {
    width: `100%`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    '& select': {
      width: `100%`,
      fontSize: `24px`,
      border: `2px solid #dbf0fd`,
      borderRadius: `8px`,
      color: `#4D6E99`,
      appearance: `none`,
      textAlign: `center`,
      background: `url(https://png.icons8.com/ios/150/3584fc/chevron-down-filled.png) 96% / 7% no-repeat white`,
      paddingRight: `32px`,
      paddingLeft: `10px`,
      transition: `border-color 0.1s linear`,
      height: `40px`,
      // testing child hover, if not do it & select:hover
      '&:hover': {
        cursor: `pointer`,
        borderColor: `#8AB2E6`
      }
    }
  },
  addEmotion: {
    display: `flex`,
    margin: `5px 0`,
    alignItems: `center`,
    justifyContent: `center`,
    '& i': {
      fontSize: `25px`,
      color: `#73E673`,
      '&:hover': {
        cursor: `pointer`,
        color: `#59B359`
      }
    }
  },
  editJournal: {
    display: `block`,
    resize: `none`,
    fontSize: `18px`,
    fontFamily: `'Kalam', cursive`,
    border: `2px solid #dbf0fd`,
    borderRadius: `8px`,
    padding: `5px`,
    color: `#4D6E99`,
    transition: `border-color 0.2s linear`,
    width: `400px`,
    '&:focus': {
      borderColor: `#8AB2E6`
    }
  },
  buttons: {
    marginTop: `15px`,
    display: `flex`,
    width: `100%`,
    alignItems: `center`,
    justifyContent: `space-evenly`
  },
  icon: {
    fontSize: 35,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  saveIcon: {
    color: `#73E673`,
    '&:hover': {
      color: `#59B359`
    }
  },
  cancelIcon: {
    color: `#cc2828`,
    '&:hover': {
      color: `#991e1e`
    }
  },
  removeIcon: {
    marginLeft: 12,
    fontSize: 22,
    color: '#cc2828',
    '&:hover': {
      color: '#991e1e',
    }
  },
};

class Edit extends Component {
  state = {
    addMoods: true
  }
  render() {
    const { addMoods } = this.state;
    const { classes, moods, selectedPixel, cancel } = this.props;
    const { journal } = selectedPixel;

    const newPixel = selectedPixel.id === '';

    return <div className={classes.container}>
      <span>How did you feel?</span>
      {
        selectedPixel.moods.map((pixelMood, moodIndex) => {
          return (
            <div className={classes.emotionsList} key={`select-${moodIndex}`}>
              <div className={classes.editEmotion}>
                <select value={pixelMood.id} data-id={pixelMood.id} onChange={this.handleSelectChange.bind(this)} >
                  {
                    moods.map((mood, userIndex) => <option key={`option-${userIndex}`} value={mood.moodID}>{mood.moodName}</option>)
                  }
                </select>
                {
                  selectedPixel.moods.length > 1 ? <input type="range" value={pixelMood.percentage} data-id={pixelMood.id} onChange={this.handleInputChange.bind(this)} min="0" max="100" /> : null
                }
              </div>
              {selectedPixel.moods.length > 1 ? <i className={`fas fa-trash-alt ${classes.icon} ${classes.removeIcon}`} onClick={this.handleMoodRemove.bind(this, pixelMood)} /> : null}
            </div>
          );
        })
      }

      {
        addMoods ? <div className={classes.addEmotion}><i className="fas fa-plus-square" onClick={this.handleAddMood.bind(this)} ></i></div> : null
      }

      <textarea className={classes.editJournal} cols="30" rows="5" placeholder="Write how did your day go (optional)" value={journal} onChange={this.handleJournalChange.bind(this)} ></textarea>
      {
        newPixel ? (
          <ButtonsContainer>
            <SubmitButton onClick={submit}>Submit</SubmitButton>
            <SubmitButton onClick={clear}>Clear</SubmitButton>
          </ButtonsContainer>
        ) : (
            <div className={classes.buttons}>
              <i className={`fas fa-save ${classes.icon} ${classes.saveIcon}`} onClick={save}></i>
              <i className={`fas fa-times ${classes.icon} ${classes.cancelIcon}`} onClick={cancel}></i>
            </div>
          )
      }
    </div>
  }

  handleSelectChange(e) {
    const { moods, selectedPixel } = this.props;
    const id = e.target.dataset.id;
    const selectedID = e.target.value;
    const selected = moods.filter(mood => mood.moodID === selectedID).map(mood => { return { id: selectedID, color: mood.moodColor, name: mood.moodName } })[0];

    // check if selectedID is available
    let available = true;
    for (let i = 0; i < selectedPixel.moods.length; i++) {
      const takenID = selectedPixel.moods[i].id;
      if (selectedID === takenID) {
        available = false;
        break;
      }
    }

    if (available) {
      updateMood(id, selected);
    }
  }
  handleInputChange(e) {
    const percentage = e.target.value;
    const id = e.target.dataset.id;
    setMoodPercentage(id, percentage);

    const { selectedPixel } = this.props;
    const { moods } = selectedPixel;

    // update other moods percentages
    calculateOtherPercentages(id, percentage, moods)
  }
  handleJournalChange(e) {
    journalChange(e.target.value);
  }
  handleAddMood() {
    const { moods, selectedPixel } = this.props;
    let newMood;
    const percentages = 100 / (selectedPixel.moods.length + 1);
    // find available mood id
    for (let i = 0; i < moods.length; i++) {
      if (!newMood) { // if mood id still hasnt been found
        const mood = moods[i];

        // check through already taken mood id's
        for (let j = 0; j < selectedPixel.moods.length; j++) {
          const takenID = selectedPixel.moods[j].id;
          if (mood.moodID === takenID) {

            // id already taken, set new percentage
            setMoodPercentage(takenID, percentages);
            break;
          } else if (j === selectedPixel.moods.length - 1) {
            // this id is available
            newMood = { id: mood.moodID, color: mood.moodColor, name: mood.moodName, percentage: percentages };
            addMood(newMood);
            if (i === moods.length - 1) {
              this.setState({ addMoods: false });
            }
          }
        }
      } else {
        break; // found it
      }
    }
  }
  handleMoodRemove(mood) {
    // first update percentages
    const { selectedPixel } = this.props;
    const percentages = 100 / (selectedPixel.moods.length - 1);
    selectedPixel.moods.forEach(mood => {
      setMoodPercentage(mood.id, percentages);
    });

    // then remove mood
    removeMood(mood.id);
  }

}

export default injectSheet(styles)(Edit);