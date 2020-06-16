import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { logInUser } from '../../api/auth';

interface AuthPayload {
  email: string;
  password: string;
}

const AuthTokenKey = 'auth:access-token';

const initialState = {
  accessToken: localStorage.getItem(AuthTokenKey),
  email: null as string | null,
};

export const logIn = createAsyncThunk(
  'logIn',
  async ({ email, password }: { email: string; password: string }) => {
    const payload = await logInUser({ email, password });
    localStorage.setItem(AuthTokenKey, payload.accessToken);
    return payload;
  }
);

const sessionSlice = createSlice({
  name: 'publicDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(logIn.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.email = action.meta.arg.email;
      })
      .addCase(logIn.rejected, (state) => {
        state.accessToken = null;
        state.email = null;
      }),
});

export default sessionSlice.reducer;
