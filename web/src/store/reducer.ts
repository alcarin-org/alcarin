import { combineReducers } from 'redux';

import sessionReducer from '../modules/publicDashboard/sessionSlice';

export default combineReducers({
  session: sessionReducer,
});
