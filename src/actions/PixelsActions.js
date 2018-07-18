import store from '../stores';
import { createNotification } from './notificationsActions';

export const getPixelMoods = () => {
  const requestMoods = () => {
    return { type: "REQUEST_PIXEL_MOODS" };
  }
  const moodsError = () => {
    return { type: "PIXEL_MOODS_ERROR" };
  }
  const moodsSuccess = (moods) => {
    return { type: "PIXEL_MOODS_SUCCESS", payload: { moods } };
  }

  store.dispatch(requestMoods());

  const token = store.getState().token;

  if (token) {
    fetch('https://api.yearsinpixels.com/api/mood', {
      method: 'GET',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (response.status === 200) {
          store.dispatch(moodsSuccess(data.moods));
        } else {
          store.dispatch(moodsError());
        }
      });
    }).catch(e => {
      store.dispatch(moodsError());
      console.error('Error while checking token:', e);
    });
  } else {
    store.dispatch(moodsError());
  }
}

export const setSelected = (date, id = '', moods = [], journal = '') => {
  if (moods.length === 0) {
    const { user } = store.getState();
    const mood = user.moods[0]
    moods = [{ id: mood.moodID, color: mood.moodColor, name: mood.moodName, percentage: 100 }]
  }

  const edit = id === '';

  store.dispatch({ type: "SET_SELECTED_PIXEL", payload: { id, date, moods, journal, edit } });
}

export const addMood = (mood) => {
  store.dispatch({ type: "ADD_SELECTED_PIXELS_MOOD", payload: { mood } })
}

export const updateMood = (id, selected) => {
  store.dispatch({ type: "UPDATE_SELECTED_PIXELS_MOOD", payload: { id, selected } });
}

export const removeMood = (id) => {
  store.dispatch({ type: "SELECTED_PIXEL_MOOD_REMOVE", payload: { id } });
}

export const setMoodPercentage = (id, percentage) => {
  store.dispatch({ type: "SET_SELECTED_PIXELS_MOOD_PERCENTAGE", payload: { id, percentage } });
}

export const journalChange = (journal) => {
  store.dispatch({ type: "CHANGE_SELECTED_PIXELS_MOOD_JOURNAL", payload: { journal } })
}

export const submit = () => {
  const { selectedPixel, token } = store.getState();
  const { moods, journal, date } = selectedPixel;

  const requestSubmit = () => {
    return { type: "REQUEST_SELECTED_PIXEL_EDIT_SUBMIT" };
  }

  const submitError = () => {
    store.dispatch(createNotification('error', "Couldn't submit, please try again!"))
    return { type: "SELECTED_PIXEL_EDIT_SUBMIT_ERROR" };
  }

  const submitSuccess = (id) => {
    return { type: "SELECTED_PIXEL_EDIT_SUBMIT_SUCCESS", payload: { id, moods, journal, date } }
  }



  const data = {
    date: date.toString(),
    dayMoods: moods.map(mood => { return { moodId: mood.id, percentage: mood.percentage } }),
    journal
  };

  store.dispatch(requestSubmit());

  if (token) {
    fetch('https://api.yearsinpixels.com/api/mood', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (response.status === 200) {
          store.dispatch(submitSuccess(data.id));
        } else {
          store.dispatch(submitError());
        }
      });
    }).catch(e => {
      store.dispatch(submitError());
    });
  } else {
    store.dispatch(submitError());
  }
}

export const save = () => {
  const requestSave = () => {
    return { type: "REQUEST_SELECTED_PIXEL_EDIT_SAVE" };
  }

  const saveError = () => {
    store.dispatch(createNotification('error', "Couldn't save, please try again!"))
    return { type: "SELECTED_PIXEL_EDIT_SAVE_ERROR" };
  }

  const saveSuccess = () => {
    return { type: "SELECTED_PIXEL_EDIT_SAVE_SUCCESS" }
  }

  const { selectedPixel, token } = store.getState();
  const { id, moods, journal } = selectedPixel;

  const data = {
    id,
    dayMoods: moods.map(mood => { return { moodId: mood.id, percentage: mood.percentage } }),
    journal
  };

  store.dispatch(requestSave());

  if (token) {
    fetch('https://api.yearsinpixels.com/api/mood', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (response.status === 200) {
          store.dispatch(saveSuccess());
        } else {
          store.dispatch(saveError());
        }
      });
    }).catch(e => {
      store.dispatch(saveError());
    });
  } else {
    store.dispatch(saveError());
  }
}

export const deletePixel = () => {
  const { selectedPixel, token } = store.getState();
  const { id } = selectedPixel;

  const removeRequest = () => {
    return { type: "REMOVE_SELECTED_PIXEL_REQUEST" };
  }

  const removeError = () => {
    return { type: "REMOVE_SELECTED_PIXEL_ERROR" };
  }
  const removeSuccess = () => {
    return { type: "REMOVE_SELECTED_PIXEL_SUCCESS", payload: { id } }
  }

  store.dispatch(removeRequest());

  if (token) {
    let data = { id };

    fetch('https://api.yearsinpixels.com/api/mood', {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (response.status === 200) {
          store.dispatch(removeSuccess());
        } else {
          store.dispatch(removeError());
        }
      });
    }).catch(e => {
      store.dispatch(removeError());
    });
  }
}

export const clear = () => {
  store.dispatch({ type: "NEW_PIXEL_CLEAR" });
}