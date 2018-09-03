import store from '../stores';

export const linkClick = () => {
  store.dispatch({ type: "MOBILE_NAV_LINK_CLICK" });
};

export const displayChange = () => {
  store.dispatch({ type: "MOBILE_NAV_DISPLAY_CHANGE" })
}