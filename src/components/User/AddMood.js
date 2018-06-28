import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `flex-start`,
    marginTop: `20px`
  },
  nameInput: {
    width: `200px !important`,
    justifySelf: `flex-start !important`,
    alignSelf: `flex-start !important`,
    margin: `0 10px 0 0 !important`,
    fontFamily: `'Indie Flower', cursive`,
    float: `right`,
    fontSize: `22px`,
    marginLeft: `20px`,
    background: `#f3fbff`,
    borderRadius: `25px`,
    border: `1px solid #d8efff`,
    padding: `5px 10px 5px 15px`,
    lineHeight: `35px`,
    caretColor: `#a1d2ff`,
    transition: `box-shadow 0.5s ease`,
    '&:focus': {
      boxShadow: `0px 0px 0px 2px #a9dbff`
    }
  },
  colorInput: {
    marginLeft: `auto`,
    width: `30px`,
    height: `30px`,
    '&:hover': {
      cursor: `pointer`
    }
  },
  button: {
    padding: `0 4px`,
    marginLeft: `30px`,
    backgroundColor: `#73E673`,
    fontSize: `25px`,
    border: `2px solid #66CC66`,
    borderRadius: `30px`,
    transition: `font-weight 0.3s ease, transform 0.3s ease, color 0.3s ease`
  }
};

class AddMood extends Component {
  constructor(props) {
    super(props);
    this.addMood = this.addMood.bind(this);
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <input type="text" className={classes.nameInput} id="mood-name-input" placeholder="Enter pixel name" />
        <input type="color" className={classes.colorInput} id="mood-color-input" />
        <button type="submit" className={classes.button} onClick={this.addMood}>Add</button>
      </div>
    );
  }
  addMood() {
    const { createNotification } = this.props;
    let moodName = document.getElementById('mood-name-input').value;
    let moodColor = document.getElementById('mood-color-input').value;
    let makeRequest = true;
    if (moodName === '') {
      makeRequest = false;
      document.getElementById('mood-name-input').setCustomValidity("Enter mood name!");
      createNotification('error', "Enter mood name!")
    } else if (moodName.length > 50) {
      makeRequest = false;
      document.getElementById('mood-name-input').setCustomValidity("Mood name can't be longer than 50 characters!");
      createNotification('error', "Mood name can't be longer than 50 characters!")
    }
    if (makeRequest) {
      document.getElementById('mood-name-input').value = '';
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      let httpRequest = new XMLHttpRequest();
      let mood = {
        moodName: moodName,
        moodColor: moodColor
      };

      httpRequest.open('POST', `https://api.yearsinpixels.com/api/user/mood`, true);
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.setRequestHeader("x-access-token", token);
      httpRequest.send(JSON.stringify(mood));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              this.props.getMoods();
            } else {
              let response = JSON.parse(httpRequest.responseText);
              if (response.hasOwnProperty('errors')) {
                response.errors.map(err => createNotification('error', err));
              } else if (response.hasOwnProperty('error')) {
                createNotification('error', response.error)
              } else {
                createNotification('error', response.message)
              }
            }
          }
        } catch (e) {
          console.error(`Caught error: `, e);
        }
      }
    }
  }
}

export default injectSheet(styles)(AddMood);