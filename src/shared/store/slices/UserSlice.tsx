import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebas";


export interface IUser{
    id: string,
    uid: string,
    userName: string,
    email: string,
    folders: [],
    settings: ISettings;
    experience: number;
    level: number;
    streak: number;
    joined: Date;
    lastLogin: Date;
    practiceDate: Date;
}

export interface ISettings {
  language: string;
  darkmode: boolean;
  wordsPerTraining: number;
}

export interface IDates {
  practiceDate: Date;
  onLogin: boolean;
  currentStreak: number;
}

export interface IUserId{
    value: string,
    token: string,
}

const initialState: IUserId = {
  value: "b",
  token: "b",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.value = action.payload;
    },
    setCurrentToken: (state, action) => {
      state.token = action.payload;
    }
  },
});

export const { setCurrentUser, setCurrentToken } = userSlice.actions;

export const getCurrentUser = () => (dispatch: any) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        dispatch(setCurrentToken(token))
        dispatch(setCurrentUser(user.uid));
      })
      
    } else {
    }
  });
};

export default userSlice.reducer;