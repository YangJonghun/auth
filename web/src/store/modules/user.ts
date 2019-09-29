import { createStandardAction, createReducer } from 'typesafe-actions';

const SET_ACCESS_TOKEN = 'user/SET_ACCESS_TOKEN' as const;

export const setAccessToken = createStandardAction(SET_ACCESS_TOKEN)<string>();

interface UserState {
  accessToken: string;
}

const initialState: UserState = {
  accessToken: '',
};

const userReducer = createReducer(initialState).handleAction(
  setAccessToken,
  (_state, action) => ({ accessToken: action.payload }),
);

export default userReducer;
