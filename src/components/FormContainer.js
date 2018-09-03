import React from 'react';
import injectSheet from 'react-jss';

import { connect } from 'react-redux';

const styles = {
  desktop: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& form': {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  mobile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& form': {
      width: '80vw',
      minWidth: 310,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }
};

const FormContainer = ({ classes, children, width }) => (
  <div className={width >= 650 ? classes.desktop : classes.mobile}>
    <form method="post">
      {children}
    </form>
  </div>
)


function mapStateToProps(state) {
  const { windowWidth } = state;
  return { width: windowWidth };
}

export default connect(mapStateToProps)(injectSheet(styles)(FormContainer));