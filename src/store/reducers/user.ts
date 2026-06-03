import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { remove } from "lodash";

type ToggleFavType = {
  id: string;
};

export type AuthUser = {
  id: string;
  email?: string;
  name: string;
  role?: "user" | "admin";
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
};

interface UserSliceTypes {
  user: AuthUser | null;
  session: AuthSession | null;
  favProducts: string[];
}

const initialState: UserSliceTypes = {
  user: null,
  session: null,
  favProducts: [],
};

type SetUserSessionPayload = {
  user: AuthUser;
  session: AuthSession | null;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleFavProduct(state, action: PayloadAction<ToggleFavType>) {
      const exists = state.favProducts.includes(action.payload.id);
      if (!exists) {
        state.favProducts.push(action.payload.id);
        return;
      }
      remove(state.favProducts, (id) => id === action.payload.id);
    },
    setUserSession(state, action: PayloadAction<SetUserSessionPayload>) {
      state.user = action.payload.user;
      state.session = action.payload.session;
    },
    clearUserSession(state) {
      state.user = null;
      state.session = null;
    },
  },
});

export const { toggleFavProduct, setUserSession, clearUserSession } =
  userSlice.actions;
export default userSlice.reducer;
