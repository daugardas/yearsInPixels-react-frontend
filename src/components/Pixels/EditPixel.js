import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    width: `400px`
  },
  date: {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    fontSize: `30px`,
    position: `relative`
  },
  settingsContainer: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    width: `min-content`,
    height: `100%`,
    zIndex: `999`,
    position: `absolute`,
    top: `0`,
    right: `0`
  },
  editIcon: {
    marginLeft: `12px`,
    fontSize: `22px`,
    color: `#E6E62E`,
    '&:hover': {
      color: `#D9D92B`,
      cursor: `pointer`
    }
  },
  removeIcon: {
    marginLeft: `12px`,
    fontSize: `22px`,
    color: `#cc2828`,
    '&:hover': {
      color: `#991e1e`,
      cursor: `pointer`
    }
  },
  removeCounter: {
    position: `absolute`,
    right: `-30px`,
    fontSize: `45px`,
    fontWeight: `bold`,
  },
  emotions: {
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
  emotion: {
    display: `flex`,
    width: `100%`,
    alignItems: `center`,
    justifyContent: `center`,
    fontSize: `30px`,
    margin: `2.5px 0`,
    border: `3px solid #dbf0fd`,
    borderRadius: `30px`,
    padding: `5px 0`
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
  journalContainer: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    flexDirection: `column`,
    width: `100%`,
    '& span': {
      fontSize: `35px`,
      color: `#364d6b`
    }
  },
  journal: {
    fontSize: `20px`,
    background: `#ffffff`,
    padding: `20px`,
    border: `3px solid #dbf0fd`,
    borderRadius: `25px`,
    whiteSpace: `pre-wrap`,
    fontFamily: `'Kalam', cursive`,
    fontWeight: `300`,
    color: `#6b6b6b`,
    width: `400px`,
    textOverflow: `clip`,
    hyphens: `auto`
  },
  savePixelContainer: {
    marginTop: `15px`,
    display: `flex`,
    width: `100%`,
    alignItems: `center`,
    justifyContent: `space-evenly`
  },
  saveIcon: {
    fontSize: `35px`,
    color: `#73E673`,
    '&:hover': {
      cursor: `pointer`,
      color: `#59B359`
    }
  },
  cancelIcon: {
    fontSize: `35px`,
    color: `#cc2828`,
    '&:hover': {
      color: `#991e1e`,
      cursor: `pointer`
    }
  }
};

class EditPixel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date,
      formattedDate: this.formatDate(`#YYYY#-#MM#-#DD#`, new Date(this.props.date)),
      dayID: this.props.dayID,
      journal: this.props.journal,
      moods: this.props.moods ? this.props.moods : [{ moodId: this.props.userMoods[0].moodID, percentage: 100 }],
      editPixel: false,
      addNewEmotions: true,
      removeCounter: 3,
      removeCounterStyle: {
        visibility: `hidden`
      }
    };
    this.formatDate = this.formatDate.bind(this);
    this.handleEditPixelClick = this.handleEditPixelClick.bind(this);
    this.addNewEmotion = this.addNewEmotion.bind(this);
    this.handleJournalChange = this.handleJournalChange.bind(this);
    this.submitEditedPixelData = this.submitEditedPixelData.bind(this);
    this.removePixel = this.removePixel.bind(this);
    this.confirmRemovePixel = this.confirmRemovePixel.bind(this);
    this.cancelRemovePixel = this.cancelRemovePixel.bind(this);
  }
  render() {
    const { userMoods, classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.date}>Date: {this.state.formattedDate}{
          !this.state.editPixel ? (
            <div className={classes.settingsContainer}>
              <i className={`fas fa-edit ${classes.editIcon}`} onClick={this.handleEditPixelClick}></i>
              <i className={`fas fa-trash-alt ${classes.removeIcon}`} onMouseDown={this.confirmRemovePixel} onMouseUp={this.cancelRemovePixel}></i>
              <div className={classes.removeCounter} style={this.state.removeCounterStyle}>{this.state.removeCounter}</div>
            </div>
          ) : null
        }
        </div>
        {
          this.state.editPixel ? (
            <div className={classes.emotions}>
              <span>How did you feel?</span>
              {this.state.moods.map((mood, moodIndex) => {
                return (
                  <div className={classes.emotionsList} key={`select-${moodIndex}`}>
                    <div className={classes.editEmotion}>
                      <select id={`emotions-select-${moodIndex}`} value={this.state.moods[moodIndex].moodId} onChange={this.handleSelectChange.bind(this, moodIndex)}>
                        {
                          userMoods.map((mood, userIndex) => <option key={`option-${userIndex}`} value={mood.moodID}>{mood.moodName}</option>)
                        }
                      </select>
                      <input type="range" id={`emotions-range-${moodIndex}`} value={this.state.moods[moodIndex].percentage} onChange={this.handleInputRangeChange.bind(this, moodIndex, mood.moodId)} min="0" max="100" />
                    </div>
                    {this.state.moods.length > 1 ? <i className={`fas fa-trash-alt ${classes.removeIcon}`} onClick={this.handleRemoveEmotion.bind(this, moodIndex)} /> : null}
                  </div>
                );
              })}
              {this.state.addNewEmotions ? <div className={classes.addEmotion}><i className="fas fa-plus-square" onClick={this.addNewEmotion}></i></div> : null}
              <textarea className={classes.editJournal} cols="30" rows="5" placeholder="Write how did your day go (optional)" value={this.state.journal} onChange={this.handleJournalChange}></textarea>
            </div>
          ) : null
        }
        {
          this.state.moods && !this.state.editPixel ? (
            <div className={classes.emotions}>
              <span>You've been</span>
              {
                this.state.moods ? this.state.moods.map(mood => {
                  return (
                    <div className={classes.emotion} style={{ background: `${mood.moodColor}` }} key={mood.moodId}>{mood.moodName}</div>
                  )
                }) : null
              }
            </div>
          ) : null
        }
        {
          this.state.journal !== "" && !this.state.editPixel ? (
            <div className={classes.journalContainer}>
              <span>Diary entry</span>
              <div className={classes.journal}>{this.state.journal}</div>
            </div>
          ) : null
        }
        {
          this.state.editPixel ? (
            <div className={classes.savePixelContainer}>
              <i className={`fas fa-save ${classes.saveIcon}`} onClick={this.submitEditedPixelData}></i>
              <i className={`fas fa-times ${classes.cancelIcon}`} onClick={this.handleEditPixelClick}></i>
            </div>
          ) : null
        }
      </div>
    );
  }
  handleRemoveEmotion(moodIndex) {
    let oldEmotions = this.state.moods;
    let newEmotions = [];
    // loop through old emotions, and push all except the one removed
    for (let i = 0; i < oldEmotions.length; i++) {
      if (i !== moodIndex) {
        newEmotions.push(oldEmotions[i]);
      }
    }
    // update percentages
    let newPercentages = 100 / newEmotions.length;
    for (let i = 0; i < newEmotions.length; i++) {
      newEmotions[i].percentage = newPercentages;
    }
    this.setState({
      moods: newEmotions
    });
    const { userMoods } = this.props;
    if (newEmotions.length !== userMoods.length) {
      this.setState({
        addNewEmotions: true
      });
    }
    console.log(`State when removed emotion:`, this.state);
  }
  handleSelectChange(moodIndex) {
    let emotions = this.state.moods;
    let newEmotionVal = document.getElementById(`emotions-select-${moodIndex}`).value;
    let change = true;
    // loop through emotions to check if it's already selected
    for (let i = 0; i < emotions.length; i++) {
      if (newEmotionVal === emotions[i].moodId && i !== moodIndex) {
        change = false;
      }
    }
    if (change) {
      emotions[moodIndex].moodId = newEmotionVal;
      this.setState({
        moods: emotions
      });
    }

    console.log(`State when selected new emotion:`, this.state);
  }
  handleInputRangeChange(moodIndex, moodId) {
    let length = this.state.moods.length;
    // if there is only one slider, keep the percentage equal to 100
    if (length > 1) {
      let slider = document.getElementById(`emotions-range-${moodIndex}`);
      let value;
      value = slider.value;
      let input = +value;
      let delta = 100 - input;
      let sum = 0;
      let siblings = [];
      // for every range input
      for (let i = 0; i < this.state.moods.length; i++) {
        // reset values for other ranges relatively
        let daymood = this.state.moods[i];
        if (daymood.moodId !== moodId) {
          siblings.push(daymood);
          sum += +daymood.percentage;
        }
      }

      let partial = 0;
      let moods = this.state.moods;
      moods[moodIndex].percentage = +value;
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

        for (let j = 0; j < moods.length; j++) {
          if (sibling.moodId === moods[j].moodId) {
            moods[j].percentage = +val;
          }
        }
      });
      this.setState({
        moods: moods
      });

      setTimeout(() => {
        console.log(`State with updated moods percentages:`, this.state);
      }, 300);
    }
  }
  handleJournalChange(event) {
    this.setState({ journal: event.target.value });
  }
  addNewEmotion() {
    // this will contain not set usermood
    let moodId = undefined;
    const { userMoods } = this.props;
    // loop through every user mood
    for (let i = 0; i < userMoods.length; i++) {
      let userMoodId = userMoods[i].moodID;
      if (moodId === undefined) {
        // loop through already set emotions
        for (let j = 0; j < this.state.moods.length; j++) {
          let takenMoodID = this.state.moods[j].moodId;
          if (takenMoodID === userMoodId) {
            // if both id are equal, just break the loop
            // cause that usermood is already taken
            break;
          } else if (j === this.state.moods.length - 1) {
            // if there still weren't any taken id with such user id
            // and its the last one from the emotions
            // it's not taken
            moodId = userMoodId;
            if (i === userMoods.length - 1) {
              this.setState({
                addNewEmotions: false
              });
            }
          }
        }
      } else {
        break;
      }
    }
    let percentage = 100 / (this.state.moods.length + 1);
    // update every selected mood percentages
    let newDayMoods = [];
    for (let i = 0; i < this.state.moods.length; i++) {
      let oldDayMood = this.state.moods[i];
      newDayMoods.push({ moodId: oldDayMood.moodId, percentage: percentage });
    }
    // add the real new mood
    newDayMoods.push({ moodId: moodId, percentage: percentage });
    this.setState({
      moods: newDayMoods
    });

    console.log(`new Day moods:`, newDayMoods);
    console.log(`State, before updating with new mood:`, this.state);
  }
  handleEditPixelClick() {
    this.setState({
      editPixel: !this.state.editPixel
    });
  }
  submitEditedPixelData() {
    const { createNotification } = this.props;
    // for every mood, append it's name and color by it's id
    let moods = this.state.moods
    for (let i = 0; i < moods.length; i++) {
      let moodID = moods[i].moodId;
      for (let j = 0; j < this.props.userMoods.length; j++) {
        let userMood = this.props.userMoods[j];
        if (moodID === userMood.moodID) {
          moods[i].moodName = userMood.moodName;
          moods[i].moodColor = userMood.moodColor;
        }
      }
    }
    let data = {
      id: this.state.dayID,
      dayMoods: this.state.moods,
      journal: this.state.journal
    };
    // eslint-disable-next-line
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('PUT', `https://api.yearsinpixels.com/api/mood`, true);
      httpRequest.setRequestHeader("x-access-token", `${token}`);
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      httpRequest.send(JSON.stringify(data));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              this.setState({
                editPixel: !this.state.editPixel
              });
              this.props.refreshPixelMoods();
            } else {
              console.log(`Edit pixel state:`, this.state);
              console.log(`Requested submit with data:`, data);
              createNotification('error', `Error ${httpRequest.status}: ${httpRequest.statusText}`)
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => console.log(err));
              } else if (response.hasOwnProperty('error')) {
                console.log(response.error)
              } else {
                console.log(response.message);
              }
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
        }
      }
    }
  }
  cancelRemovePixel() {
    clearInterval(this.removeInterval);
    this.setState({
      removeCounter: 3,
      removeCounterStyle: {
        visibility: `hidden`
      }
    });
  }
  confirmRemovePixel() {
    this.setState({
      removeCounterStyle: {
        color: `#29CC29`,
        visibility: `visible`
      }
    });
    this.removeInterval = setInterval(() => {
      this.setState({
        removeCounter: this.state.removeCounter === 0 ? 0 : this.state.removeCounter - 1
      });
      switch (this.state.removeCounter) {
        case 3:
          this.setState({
            removeCounterStyle: { color: `#29CC29` }
          });
          break;
        case 2:
          this.setState({
            removeCounterStyle: { color: `#E6E62E` }
          });
          break;
        case 1:
          this.setState({
            removeCounterStyle: { color: `#E62E2E` }
          });
          break;
        case 0:
          clearInterval(this.removeInterval);
          this.removePixel();
          break;
        default:
          this.setState({
            removeCounterStyle: { visibility: `hidden` }
          })
      }
    }, 1000);
  }
  removePixel() {
    const { createNotification } = this.props;
    let data = {
      id: this.state.dayID,
    };
    // eslint-disable-next-line
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('DELETE', `https://api.yearsinpixels.com/api/mood`, true);
      httpRequest.setRequestHeader("x-access-token", `${token}`);
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      httpRequest.send(JSON.stringify(data));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              this.props.refreshPixelMoods();
            } else {
              createNotification('error', `Error ${httpRequest.status}: ${httpRequest.statusText}`)
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => console.log(err));
              } else if (response.hasOwnProperty('error')) {
                console.log(response.error)
              } else {
                console.log(response.message);
              }
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      date: nextProps.date,
      formattedDate: this.formatDate(`#YYYY#-#MM#-#DD#`, new Date(nextProps.date)),
      dayID: nextProps.dayID,
      journal: nextProps.journal,
      moods: nextProps.moods ? nextProps.moods : [{ moodId: nextProps.userMoods[0].moodID, percentage: 100 }],
      editPixel: false
    });
  }
  formatDate(formatString, date) {
    var YYYY, MM, DD, hhhh, mm;
    YYYY = date.getFullYear()
    MM = date.getMonth() + 1 < 10 ? (`0` + (date.getMonth() + 1)) : date.getMonth() + 1;
    DD = date.getDate() < 10 ? (`0` + date.getDate()) : date.getDate();
    formatString = formatString.replace("#YYYY#", YYYY).replace("#MM#", MM).replace("#DD#", DD);
    hhhh = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
    mm = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
    return formatString.replace("#hhhh#", hhhh).replace("#mm#", mm);
  }
  componentDidUpdate() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(EditPixel);