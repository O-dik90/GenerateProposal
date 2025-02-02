import auth from './auth';
import { combineReducers } from 'redux';
import masterData from './master-data';
import proposal from './proposal';

const AppReducer = combineReducers({
  auth,
  proposal,
  masterData
});

export default AppReducer;
