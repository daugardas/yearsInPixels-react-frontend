import store from '../stores';
import { createNotification } from './notificationsActions';

export const emailChange = (email) => {
  store.dispatch({ type: "FORGOT_PASS_EMAIL_CHANGE", payload: { email } })
}

export const usernameChange = (username) => {
  store.dispatch({ type: "FORGOT_PASS_USERNAME_CHANGE", payload: { username } })
}

export const forgot = () => {
  function request() {
    return { type: "FORGOT_PASS_REQUEST" };
  }
  function error() {
    return { type: "FORGOT_PASS_ERROR" };
  }
  function success() {
    return { type: "FORGOT_PASS_SUCCESS" };
  }

  store.dispatch(request());

  const { email, username } = store.getState().forgot;

  let data = {};
  let makeRequest = true;

  const emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (username !== '') {
    data.username = username;
  } else if (emailRegEx.test(email)) {
    data.email = email;
  } else {
    makeRequest = false;
  }

  if (makeRequest) {
    fetch('https://api.yearsinpixels.com/api/forgot', {
      method: "POST",
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      response.json().then(data => {
        if (response.status === 200) {
          store.dispatch(success());
          store.dispatch(createNotification('success', data.message));
        } else {
          store.dispatch(error());
          store.dispatch(createNotification('error', data.message));
        }
      }).catch(e => {
        store.dispatch(error());
      })
    }).catch(e => {
      store.dispatch(error());
    })
  }

}

export const requestReset = (token) => {
  store.dispatch({ type: "RESET_TOKEN_REQUEST" });

  fetch('https://api.yearsinpixels.com/api/forgot', {
    method: "GET",
    headers: { 'Authorization': token }
  }).then(response => {
    response.json().then(data => {
      if (response.status === 200) {
        const { id, recoverToken, username } = data;
        store.dispatch({ type: "RESET_TOKEN_SUCCESS", payload: { id, recoverToken, username } });
      } else {
        store.dispatch({ type: "RESET_TOKEN_ERROR" });
        store.dispatch(createNotification('error', 'This link is probably expired or already used.'));
        console.log(data);
      }
    }).catch(e => {
      store.dispatch({ type: "RESET_TOKEN_ERROR" });
    })
  }).catch(e => {
    store.dispatch({ type: "RESET_TOKEN_ERROR" });
  })
}

export const newPassChange = (password) => {
  store.dispatch({ type: "RESET_CHANGE", payload: { password } })
}

export const confNewPassChange = (password) => {
  store.dispatch({ type: "RESET_CONF_PASS_CHANGE", payload: { password } })
}

const validatePasswords = (password, confPassword) => {
  return new Promise(resolve => {
    let error = false;

    if (password !== confPassword) {
      error = true;
      store.dispatch(createNotification('error', "Passwords do not match."));
    }

    if (password.length < 8) {
      error = true;
      store.dispatch(createNotification('error', "Minimum password length is 8 characters."));
    } else if (password.length > 128) {
      error = true;
      store.dispatch(createNotification('error', "Maximum password length is 128 characters."));
    } else {
      let passwordRegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/g;
      if (!passwordRegExp.test(password)) {
        error = true;
        store.dispatch(createNotification('error', "Password must be least one lowercase letter and one number or one lowecase letter and uppercase letter."));
      }
    }

    if (error) {
      throw new Error('error');
    } else {
      return resolve(true);
    }
  });
}

export const reset = () => {
  function request() {
    return { type: "RESET_REQUEST" };
  }
  function error() {
    return { type: "RESET_ERROR" };
  }
  function success() {
    return { type: "RESET_SUCCESS" };
  }
  store.dispatch(request());
  const { reset } = store.getState();
  const { password, confPassword } = reset;

  validatePasswords(password, confPassword)
    .then(fulfilled => {
      const { id, recoverToken } = reset;
      const data = { id, recoverToken, newPassword: password }

      fetch('https://api.yearsinpixels.com/api/recover', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        response.json().then(data => {
          console.log(response, data);
          if(response.status === 200){
            store.dispatch(success());
            store.dispatch(createNotification('success', data.message));
          } else {
            store.dispatch(error());
            store.dispatch(createNotification('error', "Something happened, couldn't reset your password."));
          }
        })
      }).catch(e => {
        store.dispatch(error());
      })
    }).catch(e => {
      store.dispatch(error());
    });
}