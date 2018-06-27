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
    const {classes} = this.props;
    return (
      <div className={classes.container}>
        <input type="text" className={classes.nameInput} id="mood-name-input" placeholder="Enter pixel name" />
        <input type="color" className={classes.colorInput} id="mood-color-input" />
        <button type="submit" className={classes.button} onClick={this.addMood}>Add</button>
      </div>
    );
  }
  addMood() {
    document.getElementById('messages').innerHTML = '';
    let moodName = document.getElementById('mood-name-input').value;
    let moodColor = document.getElementById('mood-color-input').value;
    let makeRequest = true;
    if (moodName === '') {
      makeRequest = false;
      document.getElementById('mood-name-input').setCustomValidity("Enter mood name!");
      this.props.messages.push({ text: "Please enter a mood name", type: "error" });
    } else if (moodName.length > 50) {
      makeRequest = false;
      document.getElementById('mood-name-input').setCustomValidity(`Mood name can't be longer than 50 characters!`);
      this.props.messages.push({ text: `Mood name can't be longer than 50 characters!`, type: "error" });
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
                response.errors.map(err => this.props.messages.push({ text: err, type: "error" }));
              } else if (response.hasOwnProperty('error')) {
                this.props.messages.push({ text: response.error, type: 'error' });
              } else {
                this.props.messages.push({ text: response.message, type: "error" })
              }
            }
            this.props.renderMessages();
          }
        } catch (e) {
          console.error(`Caught error: `, e);
          this.props.messages.push({ text: e, type: "error" });
          this.props.renderMessages();
        }
      }
    } else {
      this.props.renderMessages();
    }
  }
}

export default injectSheet(styles)(AddMood);