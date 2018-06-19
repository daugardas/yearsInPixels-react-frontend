import React, { Component } from 'react';
import Loader from './Loader';
/* import { PieChart, Pie } from 'recharts' */
import './Pixels.css';

/* class PixelPieChart extends Component {
  render() {
    return (
      <PieChart width={500} height={500}>
        <Pie data={this.props.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" />>
      </PieChart>
    );
  }
} */
class DayNumbers extends Component {
  render() {
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(<div className="day-number" key={i} >{i}</div>);
    }
    return (
      <div className="days">
        <span></span>
        {days}
      </div>
    );
  }
}
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
    const hoverBorder = this.state.background === 'transparent' ? `day-inline-border` : `day-inline-border mix-blend`;
    let dayStyles = {
      background: this.state.background
    };
    return (
      <div className="day" style={dayStyles} onClick={this.handleEditClick}>
        <div className={`${hoverBorder}${!this.state.allowEdit ? ' cursor-not-allowed':''}`} ></div>
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
class Month extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthDate: new Date(this.props.date)
    };
  }
  render() {
    const { monthDate } = this.state;
    let monthDaysCount = new Date(new Date(monthDate).setFullYear(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)).getDate();
    let monthDays = new Array(monthDaysCount);
    const { pixelMoods } = this.props;
    for (let i = 1; i <= monthDaysCount; i++) { // for every day in a month
      let dayDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), i).getTime();
      let mood;
      if (pixelMoods !== undefined) { // if there exists moods with a correct month to that mood
        for (let j = 0; j < pixelMoods.length; j++) { // loop through those moods
          if (+pixelMoods[j].date === +dayDate) { // check if mood date equal a day date
            mood = pixelMoods[j];
          }
        }
      }
      monthDays[i - 1] = { mood: mood, dayDate: dayDate }
    }
    return (
      <div className="month">
        <div className="month-name">{monthDate.toDateString().split(' ')[1]}</div>
        {
          monthDays.map((day, index) => {
            return <Day editPixel={this.props.editPixel} key={index} date={day.dayDate} userMoods={this.props.userMoods} pixelMoods={day.mood} />
          })
        }
      </div>
    );
  }
}
class NewPixel extends Component {
  constructor(props) {
    super(props);
    this.addNewEmotion = this.addNewEmotion.bind(this);
    this.handleJournalChange = this.handleJournalChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.submitPixelData = this.submitPixelData.bind(this);
    let date = this.props.date ? new Date(this.props.date) : new Date();
    this.state = {
      date: date.setHours(0, 0, 0, 0),
      dateInputValue: this.formatDate(`#YYYY#-#MM#-#DD#`, date),
      emotions: [
        { moodId: this.props.userMoods[0].moodID, percentage: 100 }
      ],
      journal: "",
      addNewEmotions: true
    };
  }
  render() {
    const { userMoods } = this.props;
    return (
      <div className="new-pixel-wrap">
        <div className="new-pixel-date">Date: {this.state.dateInputValue}</div>
        <div className="emotions">
          <span className="label">How did you feel?</span>
          {this.state.emotions.map((mood, moodIndex) => {
            return (
              <div className="new-emotion-wrap" key={`select-${moodIndex}`}>
                <div className="new-emotion">
                  <select id={`emotions-select-${moodIndex}`} value={this.state.emotions[moodIndex].moodId} onChange={this.handleSelectChange.bind(this, moodIndex)}>
                    {
                      userMoods.map((mood, userIndex) => <option key={`option-${userIndex}`} value={mood.moodID}>{mood.moodName}</option>)
                    }
                  </select>
                  { this.state.emotions.length > 1 ? <input type="range" id={`emotions-range-${moodIndex}`} value={this.state.emotions[moodIndex].percentage} onChange={this.handleInputRangeChange.bind(this, moodIndex, mood.moodId)} min="0" max="100" />:null }
                  
                </div>
                {this.state.emotions.length > 1 ? <i className="fas fa-trash-alt mood-remove" onClick={this.handleRemoveEmotion.bind(this, moodIndex)} /> : null}
              </div>
            );
          })}
          {this.state.addNewEmotions ? <div className="add-icon"><i className="fas fa-plus-square" onClick={this.addNewEmotion}></i></div> : null}
          <textarea className="journal" id="emotions-journal-0" cols="30" rows="5" placeholder="Write how did your day go (optional)" value={this.state.journal} onChange={this.handleJournalChange}></textarea>
        </div>
        <div className="submit-wrap">
          <button type="submit" className="submit-button" onClick={this.submitPixelData}>Submit</button>
        </div>
      </div>
    )
  }
  handleRemoveEmotion(moodIndex) {
    let oldEmotions = this.state.emotions;
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
      emotions: newEmotions
    });
    const { userMoods } = this.props;
    if (newEmotions.length !== userMoods.length) {
      this.setState({
        addNewEmotions: true
      });
    }
  }
  handleSelectChange(moodIndex) {
    let emotions = this.state.emotions;
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
        emotions: emotions
      });
    }
  }
  handleInputRangeChange(moodIndex, moodId) {
    let length = this.state.emotions.length;
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
      for (let i = 0; i < this.state.emotions.length; i++) {
        // reset values for other ranges relatively
        let daymood = this.state.emotions[i];
        if (daymood.moodId !== moodId) {
          siblings.push(daymood);
          sum += +daymood.percentage;
        }
      }

      let partial = 0;
      let moods = this.state.emotions;
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
        emotions: moods
      });
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
        for (let j = 0; j < this.state.emotions.length; j++) {
          let takenMoodID = this.state.emotions[j].moodId;
          if (takenMoodID === userMoodId) {
            // if both id are equal, just break the loop
            // cause that usermood is already taken
            break;
          } else if (j === this.state.emotions.length - 1) {
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
    let percentage = 100 / (this.state.emotions.length + 1);
    // update every selected mood percentages
    let newDayMoods = [];
    for (let i = 0; i < this.state.emotions.length; i++) {
      let oldDayMood = this.state.emotions[i];
      newDayMoods.push({ moodId: oldDayMood.moodId, percentage: percentage });
    }
    // add the real new mood
    newDayMoods.push({ moodId: moodId, percentage: percentage });
    this.setState({
      emotions: newDayMoods
    });
  }
  componentWillReceiveProps(nextProps) {
    let date = nextProps.date ? new Date(nextProps.date) : new Date();
    this.setState({
      date: date.setHours(0, 0, 0, 0),
      dateInputValue: this.formatDate(`#YYYY#-#MM#-#DD#`, date),
      addNewEmotions: true,
      journal: "",
      emotions: [
        { moodId: nextProps.userMoods[0].moodID, percentage: 100 }
      ],
    })
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
  };
  submitPixelData() {
    if (this.state.emotions[0].moodId !== undefined) {
      let data = {
        date: this.state.date.toString(),
        dayMoods: this.state.emotions,
        journal: this.state.journal
      };
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', `https://api.yearsinpixels.com/api/mood`, true);
        httpRequest.setRequestHeader("x-access-token", `${token}`);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(JSON.stringify(data));
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
                this.props.refreshPixelMoods();
              } else {
                this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
                let response = JSON.parse(httpRequest.responseText);
                if (response.hasOwnProperty('errors')) {
                  response.errors.map(err => console.log(err));
                } else if (response.hasOwnProperty('error')) {
                  console.log(response.error)
                } else {
                  console.log(response.message);
                }
                this.props.renderMessages();
              }
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.props.messages.push({ text: e, type: "error" });
            this.props.renderMessages();
          }
        }
      }
    }
  }
  componentDidUpdate(){
    this.props.resizeBackground();
  }
}
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
    const { userMoods } = this.props;
    return (
      <div className="new-pixel-wrap">
        <div className="new-pixel-date">Date: {this.state.formattedDate}{
          !this.state.editPixel ? (
            <div className="pixel-settings-buttons">
              <i className="fas fa-edit pixel-edit" onClick={this.handleEditPixelClick}></i>
              <i className="fas fa-trash-alt pixel-remove" onMouseDown={this.confirmRemovePixel} onMouseUp={this.cancelRemovePixel}></i>
              <div className="remove-counter" style={this.state.removeCounterStyle}>{this.state.removeCounter}</div>
            </div>
          ) : null
        }
        </div>
        {
          this.state.editPixel ? (
            <div className="emotions">
              <span className="label">How did you feel?</span>
              {this.state.moods.map((mood, moodIndex) => {
                return (
                  <div className="new-emotion-wrap" key={`select-${moodIndex}`}>
                    <div className="new-emotion">
                      <select id={`emotions-select-${moodIndex}`} value={this.state.moods[moodIndex].moodId} onChange={this.handleSelectChange.bind(this, moodIndex)}>
                        {
                          userMoods.map((mood, userIndex) => <option key={`option-${userIndex}`} value={mood.moodID}>{mood.moodName}</option>)
                        }
                      </select>
                      <input type="range" id={`emotions-range-${moodIndex}`} value={this.state.moods[moodIndex].percentage} onChange={this.handleInputRangeChange.bind(this, moodIndex, mood.moodId)} min="0" max="100" />
                    </div>
                    {this.state.moods.length > 1 ? <i className="fas fa-trash-alt mood-remove" onClick={this.handleRemoveEmotion.bind(this, moodIndex)} /> : null}
                  </div>
                );
              })}
              {this.state.addNewEmotions ? <div className="add-icon"><i className="fas fa-plus-square" onClick={this.addNewEmotion}></i></div> : null}
              <textarea className="journal" id="emotions-journal-0" cols="30" rows="5" placeholder="Write how did your day go (optional)" value={this.state.journal} onChange={this.handleJournalChange}></textarea>
            </div>
          ) : null
        }
        {
          this.state.moods && !this.state.editPixel ? (
            <div className="emotions">
              <span className="label">You've been</span>
              {
                this.state.moods ? this.state.moods.map(mood => {
                  return (
                    <div className="emotion" style={{ background: `${mood.moodColor}` }} key={mood.moodId}>{mood.moodName}</div>
                  )
                }) : null
              }
            </div>
          ) : null
        }
        {
          this.state.journal !== "" && !this.state.editPixel ? (
            <div className="journal-wrap">
              <span className="label">Diary entry</span>
              <div className="saved-journal">{this.state.journal}</div>
            </div>
          ) : null
        }
        {
          this.state.editPixel ? (
            <div className="save-pixel-wrap">
              <i className="fas fa-save save-pixel" onClick={this.submitEditedPixelData}></i>
              <i className="fas fa-times cancel-save-pixel" onClick={this.handleEditPixelClick}></i>
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

              this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => console.log(err));
              } else if (response.hasOwnProperty('error')) {
                console.log(response.error)
              } else {
                console.log(response.message);
              }
              this.props.renderMessages();
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.props.renderMessages();
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
              this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => console.log(err));
              } else if (response.hasOwnProperty('error')) {
                console.log(response.error)
              } else {
                console.log(response.message);
              }
              this.props.renderMessages();
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.props.renderMessages();
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
  componentDidUpdate(){
    this.props.resizeBackground();
  }
}
export class Pixels extends Component {
  constructor(props) {
    super(props);
    this.getUserMoods = this.getUserMoods.bind(this);
    this.getPixelMoods = this.getPixelMoods.bind(this);
    this.editPixel = this.editPixel.bind(this);
    this.editPixelRef = React.createRef();
  }
  state = {
    months: [],
    userMoods: [],
    pixelMoods: null,
    editPixel: false,
    editdayID: null,
    editDate: null,
    editJournal: "",
    editMoods: null
  }
  render() {
    if (this.state.pixelMoods !== null) {
      this.year = new Date().getFullYear();
      let months = new Array(12);
      const { pixelMoods } = this.state;
      for (let i = 0; i < 12; i++) {
        let moods = [];
        for (let j = 0; j < pixelMoods.length; j++) {
          let mood = pixelMoods[j];
          let moodDate = new Date(+mood.date);
          if (moodDate.getMonth() === i) {
            moods.push(mood)
          }
        }
        months[i] = moods;
      }
      return (
        <div className="pixels-wrap">
          {
            this.state.pixelMoods !== null ? (
              <div className="pixels-grid">
                <DayNumbers />
                {
                  months.map((month, index) => {
                    if (month.length > 0) {
                      return <Month editPixel={this.editPixel} date={new Date(this.year, index, 1).getTime()} key={index} userMoods={this.state.userMoods} pixelMoods={month} />
                    } else {
                      return <Month editPixel={this.editPixel} date={new Date(this.year, index, 1).getTime()} key={index} userMoods={this.state.userMoods} />
                    }
                  })
                }
              </div>
            ) : <Loader />
          }
          <div className="pixels-main">
            {/* <PixelPieChart pieData={this.state.pieData} /> */}
            {this.state.editPixel ? (
              <EditPixel
                dayID={this.state.editdayID}
                date={this.state.editDate}
                journal={this.state.editJournal}
                moods={this.state.editMoods}
                userMoods={this.state.userMoods}
                refreshPixelMoods={this.getPixelMoods}
                messages={this.props.messages}
                renderMessages={this.props.renderMessages}
                resizeBackground={this.props.resizeBackground} />
            ) : (
                <NewPixel
                  date={this.state.editDate}
                  userMoods={this.state.userMoods}
                  messages={this.props.messages}
                  renderMessages={this.props.renderMessages}
                  refreshPixelMoods={this.getPixelMoods}
                  resizeBackground={this.props.resizeBackground} />
              )
            }
          </div>
        </div>
      );
    } else {
      return <Loader />
    }
  }
  async editPixel(dayID, moods, journal, date) {
    if (moods) {
      // for every mood, append it's name and color by it's id
      for (let i = 0; i < moods.length; i++) {
        let moodID = moods[i].moodId;
        for (let j = 0; j < this.state.userMoods.length; j++) {
          let userMood = this.state.userMoods[j];
          if (moodID === userMood.moodID) {
            moods[i].moodName = userMood.moodName;
            moods[i].moodColor = userMood.moodColor;
          }
        }
      }
    }
    if (dayID) {
      this.setState({
        editdayID: dayID,
        editMoods: moods,
        editJournal: journal,
        editDate: date,
        editPixel: true
      });
    } else {
      this.setState({
        editdayID: dayID,
        editMoods: moods,
        editJournal: journal,
        editDate: date,
        editPixel: false
      });
    }
  }
  componentDidMount() {
    this.props.removeMessages();
    this.props.resizeBackground();
  }
  componentDidUpdate() {
    this.props.resizeBackground();
  }
  async componentWillMount() {
    await this.getUserMoods();
    await this.getPixelMoods();
  }
  getUserMoods() {
    return new Promise(resolve => {
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', `https://api.yearsinpixels.com/api/user/mood`, true);
        httpRequest.setRequestHeader("x-access-token", `${token}`);
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
                let response = JSON.parse(httpRequest.responseText);
                this.setState({ userMoods: response.moods });
              } else {
                this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
                let response = JSON.parse(httpRequest.responseText);
                if (response.hasOwnProperty('errors')) {
                  response.errors.map(err => console.log(err));
                } else if (response.hasOwnProperty('error')) {
                  console.log(response.error)
                } else {
                  console.log(response.message);
                }
                this.props.renderMessages();
              }
              return resolve(true);
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.props.messages.push({ text: e, type: "error" });
            this.props.renderMessages();
          }
        }
      }
    });
  }
  getPixelMoods() {
    return new Promise(resolve => {
      this.setState({ pixelMoods: null });
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', `https://api.yearsinpixels.com/api/mood`, true);
        httpRequest.setRequestHeader("x-access-token", `${token}`);
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
          try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
                let response = JSON.parse(httpRequest.responseText);
                this.setState({ pixelMoods: response.moods });
              } else {
                this.props.messages.push({ text: `Error ${httpRequest.status}: ${httpRequest.statusText}`, type: 'error' });
                let response = JSON.parse(httpRequest.responseText);
                if (response.hasOwnProperty('errors')) {
                  response.errors.map(err => console.log(err));
                } else if (response.hasOwnProperty('error')) {
                  console.log(response.error)
                } else {
                  console.log(response.message);
                }
                this.props.renderMessages();
              }
              return resolve(true);
            }
          } catch (e) {
            console.error(`Caught error: `, e);
            this.props.messages.push({ text: e, type: "error" });
            this.props.renderMessages();
          }
        }
      }
    });
  }
}