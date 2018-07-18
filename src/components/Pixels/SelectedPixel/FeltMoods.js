import React, { Component } from 'react';
import injectSheet from 'react-jss';

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
  mood: {
    display: `flex`,
    width: `100%`,
    alignItems: `center`,
    justifyContent: `center`,
    fontSize: `30px`,
    margin: `2.5px 0`,
    border: `3px solid #dbf0fd`,
    borderRadius: `30px`,
    padding: `5px 0`
  }
};

class FeltMoods extends Component {
  render() {
    const { classes, moods } = this.props;
    
    return (
      <div className={classes.container}>
        <span>You've been</span>
        {
           moods.map(mood => {
            return <div className={classes.mood} style={{ background: `${mood.color}` }} key={mood.id}>{mood.name}</div>;
          })
        }
      </div>
    );
  }
}

export default injectSheet(styles)(FeltMoods);