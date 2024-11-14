import { combineReducers } from 'redux';
import menu from './menu';
import proposal from './proposal';

const AppReducer = combineReducers({
  menu,
  proposal
});

export default AppReducer;
