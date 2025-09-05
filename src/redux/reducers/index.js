import {combineReducers} from 'redux';
import user from './user';
import loader from './loader';
import socket from './socket';

const allReducers = combineReducers({
  user,
  loader,
  socket,
});

export default allReducers;
