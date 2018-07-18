import store from '../stores';
import { createNotification } from './notificationsActions'

const requestRegister = () => {
  return { type: "REQUEST_REGISTER" };
}

const registerError = () => {
  return { type: "REGISTER_ERROR" };
}

const registerSuccess = () => {
  return { type: "REGISTER_SUCCESS" };
}

const validateRegister = (email, username, password, confPassword) => {
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

    // check email
    let emailRegEx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test(email)) {
      error = true;
      store.dispatch(createNotification('error', "Email adress is invalid."));
    }

    // check username
    if (username.length < 5) {
      store.dispatch(createNotification('error', "Username must be higher than 5 characters."));
      error = true;
    } else if (username.length > 35) {
      error = true;
      store.dispatch(createNotification('error', "Username must be lower than 32 characters."));
    }

    if (error) {
      throw new Error('error');
    } else {
      return resolve(true);
    }
  });
}

export const register = (email, username, password, confPassword, captchaToken) => {
  store.dispatch(requestRegister());

  validateRegister(email, username, password, confPassword)
    .then(fulfilled => {
      const requestData = {
        'username': username,
        'email': email,
        'password': password,
        'recaptchaResponse': captchaToken
      };

      fetch('https://api.yearsinpixels.com/api/register', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          response.json().then(data => {
            store.dispatch(registerSuccess());
            store.dispatch(createNotification('success', "Succesfully registered, now you can login!"));
          }).catch(e => {
            store.dispatch(registerError());
            console.log('Error while converting response to json:', e);
          })
        })
        .catch(e => {
          store.dispatch(registerError());
          console.log('Error while sending register request:', e);
        })
    })
    .catch(err => {
      store.dispatch(registerError());
    });
}