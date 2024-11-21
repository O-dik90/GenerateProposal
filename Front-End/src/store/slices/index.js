import { combineReducers } from 'redux';
import masterData from './master-data';
import menu from './menu';
import proposal from './proposal';

const AppReducer = combineReducers({
  menu,
  proposal,
  masterData
});

export default AppReducer;
