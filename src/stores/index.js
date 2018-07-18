import { createStore } from 'redux';
import reducer from '../reducers';
import initialState from './initialState';

const store = createStore(reducer, initialState);

export default store;