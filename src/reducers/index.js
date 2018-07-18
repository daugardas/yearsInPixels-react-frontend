//import { combineReducers } from 'redux'
import initialState from '../stores/initialState';

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  console.log(`%cEvent: ${type}`, "color: white; background: darkred; font-size: 20px");

  switch (type) {
    case "REQUEST_USER_DATA":
      return { ...state, loading: true };
    case "RECEIVE_USER_DATA_ERROR":
      return { ...state, loading: false };
    case "RECEIVE_USER_DATA_SUCCESS":
      const { data, token } = payload;
      return {
        ...state,
        loggedIn: true,
        token: token,
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          created: data.dateCreated,
          moods: data.moods
        }
      }
    case "CREATE_NOTIFICATION":
      const newNotification = payload.notification;

      let createNotification = true;
      state.notifications.forEach(notification => {
        if (notification.type === newNotification.type && notification.text === newNotification.text) {
          createNotification = false;
        }
      });

      if (createNotification) {
        let notifyID = window.crypto.getRandomValues(new Uint32Array(1));
        return { ...state, notifications: [...state.notifications, { id: notifyID, type: newNotification.type, text: newNotification.text, remove: false }] }
      }
      return state;
    case "DELETE_ALL_NOTIFICATIONS":
      return { ...state, notifications: [] };
    case "DELETE_NOTIFICATION":
      const { id } = payload;
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== id)
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loggedIn: true,
        token: payload.data.token,
        user: {
          id: payload.data.data.id,
          username: payload.data.data.username,
          email: payload.data.data.email,
          created: payload.data.data.dateCreated,
          moods: payload.data.data.moods
        }
      }

    case "UPDATE_PROFILE_SUCCESS":
      let { user } = payload;
      return {
        ...state,
        token: payload.token,
        user: {
          ...state.user,
          id: user.id,
          username: user.username,
          email: user.email,
          created: user.created
        }
      };

    case "ACCOUNT_DELETE_SUCCESS":
      return { ...initialState, loading: false, notifications: state.notifications }
    case "REQUEST_MOOD_DELETE":
      let moods = state.user.moods.map(mood => mood.moodID === payload.id ? { ...mood, removed: true } : mood);
      return {
        ...state,
        user: {
          ...state.user,
          moods: moods
        }
      };
    case "MOOD_DELETE_ERROR":
      moods = state.user.moods.map(mood => mood.moodID === payload.id ? { ...mood, removed: false } : mood);
      return {
        ...state,
        user: {
          ...state.user,
          moods: moods
        }
      };

    case "REQUEST_MOOD_EDIT":
      const { moodID, moodName, moodColor } = payload.data;
      moods = state.user.moods.map(mood => mood.moodID === moodID ? { ...mood, moodName, moodColor } : mood);
      return {
        ...state,
        user: {
          ...state.user,
          moods: moods
        }
      };

    case "MOOD_CREATE_SUCCESS":
      let { mood } = payload;
      moods = Array.apply(this, state.user.moods);
      moods.push(mood);
      return {
        ...state,
        user: {
          ...state.user,
          moods: moods
        }
      };
    case "LOG_OUT":
      return { ...initialState, loading: false };

    case "REQUEST_PIXEL_MOODS":
      return { ...state, loading: true };

    case "PIXEL_MOODS_SUCCESS":
      moods = payload.moods;
      return { ...state, loading: false, pixelMoods: moods };

    case "SET_SELECTED_PIXEL":
      return {
        ...state, selectedPixel: {
          history: {
            moods: payload.moods,
            journal: payload.journal
          }, changed: false, id: payload.id, date: payload.date, moods: payload.moods, journal: payload.journal, edit: payload.edit
        }
      }

    case "SELECTED_PIXEL_MOOD_REMOVE":
      return {
        ...state,
        selectedPixel: {
          ...state.selectedPixel,
          moods: state.selectedPixel.moods.filter(mood => {
            return mood.id !== payload.id
          })
        }
      };

    case "SET_SELECTED_PIXEL_EDIT":
      const historyMoods = payload.edit ? state.selectedPixel.moods : [];
      return {
        ...state,
        selectedPixel: {
          ...state.selectedPixel,
          edit: payload.edit,
          historyMoods: historyMoods
        }
      };

    case "CANCEL_SELECTED_PIXEL_EDIT":
      return {
        ...state,
        selectedPixel: {
          ...state.selectedPixel,
          edit: false,
          changed: false,
          moods: state.selectedPixel.history.moods,
          journal: state.selectedPixel.history.journal
        }
      };

    case "SET_SELECTED_PIXELS_MOOD_PERCENTAGE":
      return {
        ...state,
        selectedPixel: {
          ...state.selectedPixel,
          changed: true,
          moods: state.selectedPixel.moods.map(mood => mood.id === payload.id ? { ...mood, percentage: payload.percentage } : mood)
        }
      };

    case "ADD_SELECTED_PIXELS_MOOD":
      return {
        ...state,
        selectedPixel: {
          ...state.selectedPixel,
          changed: true,
          moods: [...state.selectedPixel.moods, payload.mood]
        }
      };
    case "UPDATE_SELECTED_PIXELS_MOOD":
      return {
        ...state,
        selectedPixel: {
          ...state.selectedPixel,
          changed: true,
          moods: state.selectedPixel.moods.map(mood => mood.id === payload.id ? { ...mood, id: payload.selected.id, name: payload.selected.name, color: payload.selected.color } : mood)
        }
      };
    case "CHANGE_SELECTED_PIXELS_MOOD_JOURNAL":
      return { ...state, selectedPixel: { ...state.selectedPixel, changed: true, journal: payload.journal } };
    case "NEW_PIXEL_CLEAR":
      return { ...state, selectedPixel: { ...state.selectedPixel, moods: state.selectedPixel.history.moods, journal: state.selectedPixel.history.journal, changed: false } }
    case "SELECTED_PIXEL_EDIT_SAVE_SUCCESS":
      return { ...state, selectedPixel: { ...state.selectedPixel, edit: false, changed: false } };

    case "SELECTED_PIXEL_EDIT_SAVE_ERROR":
      return state;

    case "SELECTED_PIXEL_EDIT_SUBMIT_SUCCESS":
      return {
        ...state,
        selectedPixel: { ...state.selectedPixel, edit: false, changed: false },
        pixelMoods: [
          ...state.pixelMoods,
          {
            date: payload.date.toString(),
            dayMoods: payload.moods.map(mood => { return { moodId: mood.id, percentage: mood.percentage } }),
            id: payload.id,
            journal: payload.journal
          }
        ]
      };

    case "SELECTED_PIXEL_EDIT_SUBMIT_ERROR":
      return state;
    case "REMOVE_SELECTED_PIXEL_SUCCESS":
      mood = state.user.moods[0]
      moods = [{ id: mood.moodID, color: mood.moodColor, name: mood.moodName, percentage: 100 }]
      return {
        ...state,
        selectedPixel: {
          ...state.selectedPixel,
          changed: false,
          history: {
            moods: moods,
            journal: ''
          },
          edit: true,
          id: '',
          moods: moods,
          journal: ''
        },
        pixelMoods: state.pixelMoods.filter(mood => {
          return mood.id !== payload.id;
        })
      };

    case "FORGOT_PASS_EMAIL_CHANGE":
      return {
        ...state,
        forgot: {
          ...state.forgot,
          email: payload.email,
          username: ''
        }
      };
    case "FORGOT_PASS_USERNAME_CHANGE":
      return {
        ...state,
        forgot: {
          ...state.forgot,
          username: payload.username,
          email: ''
        }
      }

    case "RESET_TOKEN_SUCCESS":
      return {
        ...state,
        reset: {
          ...state.reset,
          loading: false,
          id: payload.id,
          recoverToken: payload.recoverToken,
          username: payload.username
        }
      }
    case "RESET_CHANGE":
      return {
        ...state,
        reset: {
          ...state.reset,
          password: payload.password
        }
      };
    case "RESET_CONF_PASS_CHANGE":
      return {
        ...state,
        reset: {
          ...state.reset,
          confPassword: payload.password
        }
      }
    case "RESET_ERROR":
      return {
        ...state,
        reset: {
          ...state.reset,
          redirectTo: '/forgot'
        }
      }
    case "RESET_SUCCESS":
      return {
        ...state,
        reset: {
          ...state.reset,
          redirectTo: '/login'
        }
      }
    default:
      return state;
  }
}
/* switch () {
  case "CREATE_NOTIFICATION":
    
    // check if same notification exists
    let createNotification = true;
    state.notifications.forEach(notification => {
      if (notification.type === type && notification.text === text) {
        createNotification = false;
      }
    });

    if (createNotification) {
      let notifyID = window.crypto.getRandomValues(new Uint32Array(1));
      return { ...state, notifications: [...state.notifications, { id: notifyID, type: type, text: text, remove: false }] }
    }
    return state;
  case "DELETE_NOTIFICATION":
    const { id } = payload;
    return {
      ...state,
      notifications: state.notifications.filter(notification => notification.id !== id)
    };
  case "DELETE_ALL_NOTIFICATIONS":
    return { ...state, notifications: [] };
} */

export default reducer;