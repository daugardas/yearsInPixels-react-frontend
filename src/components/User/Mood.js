import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `flex-start`,
    '& label': {
      fontSize: `32px`,
      color: `#364d6b`
    }
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
  saveIcon: {
    marginLeft: `12px`,
    fontSize: `22px`,
    color: `#73E673`,
    '&:hover': {
      cursor: `pointer`,
      color: `#59B359`
    }
  },
  cancelIcon: {
    marginLeft: `12px`,
    fontSize: `22px`,
    color: `#cc2828`,
    '&:hover': {
      cursor: `pointer`,
      color: `#59B359`
    }
  },
  editIcon: {
    marginLeft: `12px`,
    fontSize: `22px`,
    color: `#E6E62E`,
    '&:hover': {
      cursor: `pointer`,
      color: `#D9D92B`
    }
  },
  removeIcon: {
    marginLeft: `12px`,
    fontSize: `22px`,
    color: `#cc2828`,
    '&:hover': {
      cursor: `pointer`,
      color: `#59B359`
    }
  }
};

class Mood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removed: false,
      edit: false,
      moodName: this.props.mood.moodName,
      moodColor: this.props.mood.moodColor
    };
    this.removeMood = this.removeMood.bind(this);
    this.editMood = this.editMood.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }
  render() {
    const { classes } = this.props;
    let mood = this.state.edit ? (
      <div className={classes.container}>
        <input type="text" defaultValue={this.state.moodName} className={classes.nameInput} id="edit-mood-name-input" placeholder="Enter pixels name" onChange={this.handleNameChange} />
        <input type="color" value={this.state.moodColor} className={classes.colorInput} id="edit-mood-color-input" onChange={this.handleColorChange} />
        <i className={`fas fa-save ${classes.saveIcon}`} onClick={this.editMood}></i>
        <i className={`fas fa-times ${classes.cancelIcon}`} onClick={this.handleEditClick}></i>
      </div>
    ) : (
        <div className={classes.container}>
          <label>{this.state.moodName}</label>
          <input type="color" className={classes.colorInput} value={this.state.moodColor} readOnly />
          <i className={`fas fa-edit ${classes.editIcon}`} onClick={this.handleEditClick}></i>
          <i className={`fas fa-trash-alt ${classes.removeIcon}`} onClick={this.removeMood}></i>
        </div>
      );
    let element = this.state.removed ? null : mood;
    return element;
  }
  handleEditClick() {
    this.setState({ edit: !this.state.edit })
  }
  handleNameChange(event) {
    this.setState({ moodName: event.target.value });
  }
  handleColorChange(event) {
    this.setState({ moodColor: event.target.value });
  }
  removeMood() {
    this.setState({ removed: true });
    const { createNotification } = this.props;
    // eslint-disable-next-line
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let httpRequest = new XMLHttpRequest();
    let remove = {
      moodID: this.props.mood.moodID
    };
    httpRequest.open('DELETE', `https://api.yearsinpixels.com/api/user/mood`, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.setRequestHeader("x-access-token", token);
    httpRequest.send(JSON.stringify(remove));
    httpRequest.onreadystatechange = () => {
      try {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            // do nothing
          } else {
            let response = JSON.parse(httpRequest.responseText);
            if (response.hasOwnProperty('error')) {
              createNotification('error', response.error);
            } else {
              createNotification('error', response.message);
            }
            this.setState({ removed: false });
          }
        }
      } catch (e) {
        console.error(`Caught error: `, e);
      }
    }
  }
  editMood() {
    const { createNotification } = this.props;
    let makeRequest = true;
    if (this.state.moodName === '') {
      makeRequest = false;
      document.getElementById('edit-mood-name-input').setCustomValidity("Enter pixels name!");
      createNotification('error', "Enter pixels name!");
    } else if (this.state.moodName.length > 50) {
      makeRequest = false;
      document.getElementById('edit-mood-name-input').setCustomValidity("Pixels name can't be longer than 50 characters!");
      createNotification('error', "Pixels name can't be longer than 50 characters!");
    }
    if (makeRequest) {
      // eslint-disable-next-line
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      let httpRequest = new XMLHttpRequest();
      let mood = {
        moodName: this.state.moodName,
        moodColor: this.state.moodColor,
        moodID: this.props.mood.moodID
      };
      httpRequest.open('PUT', `https://api.yearsinpixels.com/api/user/mood`, true);
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.setRequestHeader("x-access-token", token);
      httpRequest.send(JSON.stringify(mood));
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              this.setState({
                edit: false,
              })
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
            this.props.renderMessages();
          }
        } catch (e) {
          console.error(`Caught error: `, e);
        }
      }
    }
  }
}

export default injectSheet(styles)(Mood);