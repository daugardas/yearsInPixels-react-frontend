import store from '../stores';
import { createNotification } from './notificationsActions'
import { getPixelMoods } from './PixelsActions';

const requestLogin = () => {
  return { type: "REQUEST_LOGIN" };
}

const loginError = () => {
  return { type: "LOGIN_ERROR" };
}

const loginSuccess = (data) => {
  const moods = data.data.moods.map(mood => {
    return {...mood, removed: false};
  });
  data = {...data, data: { ...data.data, moods: moods }};
  return { type: "LOGIN_SUCCESS", payload: {data} };
}

export const login = (requestData) => {
  store.dispatch(requestLogin());

  fetch('https://api.yearsinpixels.com/api/login', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      response.json().then(data => {
        if(response.status === 200){
          document.cookie = `token=${data.token}`;
          store.dispatch(loginSuccess(data));
          getPixelMoods() // request day data just after logging in
        } else {
          store.dispatch(loginError());
          store.dispatch(createNotification('error', data.message));
        }
      }).catch(e => {
        store.dispatch(loginError());
        console.log('Error while converting response to json:', e);
      })
    })
    .catch(e => {
      store.dispatch(loginError());
      console.log('Error while sending login request:', e);
    })
}