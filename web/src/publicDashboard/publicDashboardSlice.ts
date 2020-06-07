import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { registerUser, logIn } from '../api/auth';

interface AuthPayload {
  email: string;
  password: string;
}

const initialState = {
  test: 0,
};

export const signUp = createAsyncThunk(
  'signUp',
  async ({ email, password }: { email: string; password: string }) => {
    console.log('b');
    const response = await registerUser({ email, password });
    console.log('a', response);
    return response;
  }
);

const publicDashboardSlice = createSlice({
  name: 'publicDashboard',
  initialState,
  reducers: {
    setTest(state, action: PayloadAction<number>) {
      state.test += action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        state.test = 666;
        console.log(action);
        // both `state` and `action` are now correctly typed
        // based on the slice state and the `pending` action creator
      })
      .addCase(signUp.rejected, (state, action) => {
        console.log(action);
        state.test = 999;
        // both `state` and `action` are now correctly typed
        // based on the slice state and the `pending` action creator
      }),
});

export const { setTest } = publicDashboardSlice.actions;

export default publicDashboardSlice.reducer;
