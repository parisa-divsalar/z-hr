import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  user: null | { id: string; name: string; email: string };
}

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  user: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
  },
});

export const { setToken } = userSlice.actions;
export default userSlice.reducer;
