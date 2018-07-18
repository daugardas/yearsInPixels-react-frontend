import store from '../stores';

export const logout = () => {
  document.cookie = `token=;`;
  store.dispatch({ type: "LOG_OUT" });
}