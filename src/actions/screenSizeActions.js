import store from '../stores';

export const widthChange = () => {
  store.dispatch({ type: "SCREEN_WIDTH_CHANGE" })
}