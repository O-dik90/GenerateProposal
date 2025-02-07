import auth from './auth';
import { combineReducers } from 'redux';
import masterData from './master-data';
import proposal from './proposal';
import user from './user';

const AppReducer = combineReducers({
  user,
  auth,
  proposal,
  masterData
});

export default AppReducer;
