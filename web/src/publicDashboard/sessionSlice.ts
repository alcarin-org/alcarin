import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { logInUser } from '../api/auth';

interface AuthPayload {
  email: string;
  password: string;
}

const initialState = {
  authToken: null as string | null,
  email: null as string | null,
};

export const logIn = createAsyncThunk(
  'logIn',
  async ({ email, password }: { email: string; password: string }) => {
    return logInUser({ email, password });
  }
);

const sessionSlice = createSlice({
  name: 'publicDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(logIn.fulfilled, (state, action) => {
        state.authToken = action.payload.accessToken;
        state.email = action.meta.arg.email;
      })
      .addCase(logIn.rejected, (state) => {
        state.authToken = null;
        state.email = null;
      }),
});

export default sessionSlice.reducer;
