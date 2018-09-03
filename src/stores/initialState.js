const initialState = {
  user: {
    id: '',
    username: '',
    email: '',
    created: undefined,
    moods: []
  },
  pixelMoods: [],
  selectedPixel: {
    changed: false,
    history: {
      moods: [],
      journal: ''
    },
    edit: false,
    id: '',
    date: new Date().setHours(0, 0, 0, 0), // initialize todays date
    moods: [],
    journal: ''
  },
  token: '',
  loading: true,
  loggedIn: false,
  notifications: [],
  forgot: {
    email: '',
    username: ''
  },
  reset: {
    loading: true,
    id: '',
    username: '',
    recoverToken: '',
    redirectTo: '',
    password: '',
    confPassword: ''
  },
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  displayMobileNav: false
};

export default initialState;