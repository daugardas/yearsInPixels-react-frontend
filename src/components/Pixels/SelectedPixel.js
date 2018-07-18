import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { connect } from 'react-redux';

import Date from './SelectedPixel/Date';
import Edit from './SelectedPixel/Edit';
import Display from './SelectedPixel/Display';
import Buttons from './SelectedPixel/Buttons';

import { deletePixel } from '../../actions/PixelsActions';

const styles = {
  container: {
    width: 400,
    position: 'relative'
  },
};

class SelectedPixel extends Component {

  render() {
    const { classes, moods, selectedPixel } = this.props;
    return (
      <div className={classes.container}>
        <Buttons display={!selectedPixel.edit} onEdit={this.handleEditClick.bind(this)} onRemove={this.removePixel} />
        <Date date={selectedPixel.date} />
        {selectedPixel.edit ? <Edit selectedPixel={selectedPixel} moods={moods} cancel={this.handleCancelClick.bind(this)} /> : <Display selectedPixel={selectedPixel} />}
      </div>
    );
  }
  handleEditClick() {
    const { dispatch, selectedPixel } = this.props;
    dispatch({ type: "SET_SELECTED_PIXEL_EDIT", payload: { edit: !selectedPixel.edit } });
  }
  handleCancelClick() {
    const { dispatch } = this.props;
    dispatch({ type: "CANCEL_SELECTED_PIXEL_EDIT" });
  }
  removePixel() {
    deletePixel()
  }
}

function mapStateToProps(state) {
  return { selectedPixel: state.selectedPixel, moods: state.user.moods }
}

export default connect(mapStateToProps)(injectSheet(styles)(SelectedPixel));