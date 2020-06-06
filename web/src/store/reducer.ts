import { combineReducers } from 'redux';

import publicDashboardReducer from '../publicDashboard/publicDashboardSlice';

export default combineReducers({
  publicDashboard: publicDashboardReducer,
});
