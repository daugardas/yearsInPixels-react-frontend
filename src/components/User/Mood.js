import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { deleteMood, editMood } from '../../actions/UserActions';

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
    const { removed } = this.props.mood;
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
    let element = removed ? null : mood;
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
    const { mood } = this.props;
    deleteMood(mood.moodID);
  }
  editMood() {
    this.handleEditClick();
    editMood(this.props.mood.moodID, this.state.moodName, this.state.moodColor).then(() => {
      this.setState({ edit: false})
    })
  }
}

export default injectSheet(styles)(Mood);