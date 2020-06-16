import { combineReducers } from 'redux';

import sessionReducer from '../publicDashboard/sessionSlice';

export default combineReducers({
  session: sessionReducer,
});
