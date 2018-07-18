import store from '../stores';
import { createNotification } from './notificationsActions';

export const updateProfile = (username, email, password, newPassword, confNewPassword) => {
  const requestUpdate = () => {
    return { type: "REQUEST_UPDATE_PROFILE" };
  }

  const updateError = () => {
    return { type: "UPDATE_PROFILE_ERROR" };
  }

  const updateSuccess = (data) => {
    return { type: "UPDATE_PROFILE_SUCCESS", payload: { user: data.data, token: data.token } };
  }

  const validateUpdate = (username, email, password, newPassword, confNewPassword) => {
    return new Promise(resolve => {
      let user = { password: password };
      let error = false;
      if (password === '') {
        error = true;
        store.dispatch(createNotification('error', 'Enter your password.'));
      } else {
        if (newPassword !== "") {
          user.newPassword = newPassword;
          if (newPassword !== confNewPassword) {
            error = true;
            store.dispatch(createNotification('error', "Passwords do not match."));
          }
          if (newPassword.length < 8) {
            error = true;
            store.dispatch(createNotification('error', "Minimum password length is 8 characters."));
          } else if (newPassword.length > 128) {
            error = true;
            store.dispatch(createNotification('error', "Maximum password length is 128 characters."));
          } else {
            let passwordRegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/g;
            if (!passwordRegExp.test(newPassword)) {
              error = true;
              store.dispatch(createNotification('error', "Password must be have one lowercase letter and one number or one lowecase letter and uppercase letter"));
            }
          }
        }

        if (email !== "") {
          user.newEmail = email;
          let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!emailRegEx.test(email)) {
            error = true;
            store.dispatch(createNotification('error', "Email adress is invalid."));
          }
        }

        if (username !== "") {
          user.newUsername = username;

          if (username.length < 2) {
            store.dispatch(createNotification('error', "Username must be longer than 2 characters."));
            error = true;
          } else if (username.length > 35) {
            error = true;
            store.dispatch(createNotification('error', "Username must be shorter than 32 characters."));
          }
        }
      }

      if (error)
        throw new Error('Wrong input.');
      else
        return resolve(user);
    })
  }

  store.dispatch(requestUpdate());

  validateUpdate(username, email, password, newPassword, confNewPassword).then(user => {
    const token = store.getState().token;
    if (token) {
      fetch('https://api.yearsinpixels.com/api/user', {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(data => {
          if (response.status === 201) {
            document.cookie = `token=${data.token}`;
            store.dispatch(updateSuccess(data));
            store.dispatch(createNotification('success', "Succesfully updated your information!"));
          } else {
            store.dispatch(updateError());
            store.dispatch(createNotification('error', data.error));
          }

        });
      }).catch(e => {
        store.dispatch(updateError());
        console.error('Error while checking token:', e);
      });
    } else {
      store.dispatch(updateError());
    }
  }).catch(err => {
    store.dispatch(updateError());
  })
}

export const deleteProfile = (password) => {
  const requestAccDelete = () => {
    return { type: 'REQUEST_ACCOUNT_DELETE' };
  }

  const accDeleteError = () => {
    return { type: "ACCOUNT_DELETE_ERROR" };
  }

  const accDeleteSuccess = () => {
    return { type: "ACCOUNT_DELETE_SUCCESS" };
  }

  store.dispatch(requestAccDelete());
  let error = false;
  if (password === '') {
    error = true;
    store.dispatch(createNotification('error', 'Enter your password.'));
  }

  if (!error) {
    const requestData = { password };

    const token = store.getState().token;
    if (token) {
      fetch('https://api.yearsinpixels.com/api/user', {
        method: 'DELETE',
        body: JSON.stringify(requestData),
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(data => {
          console.log(response, data);
          if (response.status === 200) {
            document.cookie = `token=;`;
            store.dispatch(createNotification('success', "Succesfully deleted your account!"));
            store.dispatch(accDeleteSuccess(data))
          } else {
            store.dispatch(createNotification('error', data.error));
            store.dispatch(accDeleteError());
          }
        });
      }).catch(e => {
        store.dispatch(accDeleteError());
        console.error('Error while checking token:', e);
      });
    } else {
      store.dispatch(accDeleteError());
    }
  } else {
    store.dispatch(accDeleteError());
  }

}

export const deleteMood = (id) => {
  const requestMoodDelete = () => {
    return { type: "REQUEST_MOOD_DELETE", payload: { id } };
  }
  const moodDeleteError = () => {
    return { type: "MOOD_DELETE_ERROR", payload: { id } };
  }
  const moodDeleteSuccess = () => {
    return { type: "MOOD_DELETE_SUCCESS" }
  }

  store.dispatch(requestMoodDelete());

  const requestData = { moodID: id };
  const token = store.getState().token;
  if (token) {
    fetch('https://api.yearsinpixels.com/api/user/mood', {
      method: 'DELETE',
      body: JSON.stringify(requestData),
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (response.status === 200) {
          store.dispatch(moodDeleteSuccess());
        } else {
          store.dispatch(moodDeleteError());
          store.dispatch(createNotification('error', data.error));
        }
      });
    }).catch(e => {
      store.dispatch(moodDeleteError());
      console.error('Error while checking token:', e);
    });
  } else {
    store.dispatch(moodDeleteError());
  }
}

export const editMood = (id, name, color) => {
  const requestData = { moodID: id, moodName: name, moodColor: color };

  const requestMoodEdit = () => {
    return { type: "REQUEST_MOOD_EDIT", payload: { data: requestData } };
  }
  const moodEditError = () => {
    return { type: "MOOD_EDIT_ERROR" };
  }
  const moodEditSuccess = () => {
    return { type: "MOOD_EDIT_SUCCESS" }
  }

  return new Promise(resolve => {
    store.dispatch(requestMoodEdit());

    if (name === '') {
      store.dispatch(moodEditError());
      store.dispatch(createNotification('error', "Enter pixels name!"));
    } else {

      const token = store.getState().token;

      if (token) {
        fetch('https://api.yearsinpixels.com/api/user/mood', {
          method: 'PUT',
          body: JSON.stringify(requestData),
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }).then(response => {
          response.json().then(data => {
            if (response.status === 200) {
              store.dispatch(moodEditSuccess());
            } else {
              store.dispatch(moodEditError());
              store.dispatch(createNotification('error', data.error));
            }
            return resolve(true);
          });
        }).catch(e => {
          store.dispatch(moodEditError());
          console.error('Error while checking token:', e);
          return resolve(true);
        });
      } else {
        store.dispatch(moodEditError());
      }
    }
  });

}

export const createMood = (name, color) => {
  const requestData = {
    moodName: name,
    moodColor: color
  }

  const requestMoodCreate = () => {
    return { type: "REQUEST_MOOD_CREATE" };
  }
  const moodCreateError = () => {
    return { type: "MOOD_CREATE_ERROR" };
  }
  const moodCreateSuccess = (mood) => {
    return { type: "MOOD_CREATE_SUCCESS", payload: {mood} }
  }

  store.dispatch(requestMoodCreate());

  if (name === '') {
    store.dispatch(createNotification('error', "Enter mood name!"));
  } else if (name.length > 50) {
    store.dispatch(createNotification('error', "Mood name can't be longer than 50 characters!"));
  } else {
    const token = store.getState().token;

    if (token) {
      fetch('https://api.yearsinpixels.com/api/user/mood', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(data => {
          if (response.status === 200) {
            store.dispatch(moodCreateSuccess(data.mood));
          } else {
            store.dispatch(moodCreateError());
            store.dispatch(createNotification('error', data.error));
          }
        });
      }).catch(e => {
        store.dispatch(moodCreateError());
        console.error('Error while checking token:', e);
      });
    } else {
      store.dispatch(moodCreateError());
    }
  }
}