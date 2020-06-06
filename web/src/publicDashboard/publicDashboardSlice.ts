import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  test: 0,
};

const publicDashboardSlice = createSlice({
  name: 'publicDashboard',
  initialState,
  reducers: {
    setTest(state, action: PayloadAction<number>) {
      state.test += action.payload;
    },
  },
});

export const { setTest } = publicDashboardSlice.actions;

export default publicDashboardSlice.reducer;
