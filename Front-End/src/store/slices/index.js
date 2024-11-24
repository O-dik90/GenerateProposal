import { combineReducers } from 'redux';
import masterData from './master-data';
import proposal from './proposal';

const AppReducer = combineReducers({
  proposal,
  masterData
});

export default AppReducer;
