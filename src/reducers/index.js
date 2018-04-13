import { combineReducers } from 'redux';
import Main from './main';
import Auth from './auth';

export default combineReducers({
  main: Main,
  auth: Auth
});