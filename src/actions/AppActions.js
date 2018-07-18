import store from '../stores';
import { getPixelMoods } from './PixelsActions';

export const requestUserData = () => {
  return { type: "REQUEST_USER_DATA" }
}

export const receiveUserDataError = () => {
  return { type: "RECEIVE_USER_DATA_ERROR" }
}

export const receiveUserDataSuccess= (data, token) => {  
  const moods = data.moods.map(mood => {
    return {...mood, removed: false};
  });

  data = {...data, moods: moods};
  return { type: "RECEIVE_USER_DATA_SUCCESS", payload: { data, token } }
}

export const tokenCheck = () => {
  store.dispatch(requestUserData());

  // eslint-disable-next-line
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if (token) {
    const headers = new Headers({ 'x-access-token': token });
    const requestInit = { method: 'GET', headers: headers }
    const request = new Request('https://api.yearsinpixels.com/api/user', requestInit);

    fetch(request).then(response => {
      response.json().then(data => {
        store.dispatch(receiveUserDataSuccess(data, token));
        getPixelMoods() // request day data just after logging in
      });
    }).catch(e => {
      store.dispatch(receiveUserDataError());
      console.error('Error while checking token:', e);
    });
  } else {
    console.log('No token');
    store.dispatch(receiveUserDataError());
  }
};