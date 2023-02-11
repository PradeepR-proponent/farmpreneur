import { createSlice } from '@reduxjs/toolkit';
import appConstant from '../config/constants';
export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoading: true,
        isSignout: false,
        userToken: null,
        userType: null,
        appLanguage: appConstant.Languages[0]
    },
    reducers: {
        RESTORE_TOKEN: (state, action) => {
            state.userToken = action.payload.token;
            state.isLoading = false;
            state.userType = action.payload.userType;
        },
        SIGN_IN: (state, action) => {
            state.isSignout = false;
            state.userToken = action.payload.token;
            state.userType = action.payload.userType;
        },
        SIGN_OUT: state => {
            state.isSignout = true;
            state.userToken = null;
            state.userType = null;
        },
        LANGUAGE: (state, action) => {
            state.appLanguage = action.payload.language
        }




    },
});

export const { RESTORE_TOKEN, SIGN_IN, SIGN_OUT, LANGUAGE } = slice.actions;
export const isSignout = state => state.auth.isSignout;
export const userToken = state => state.auth.userToken;
export const isLoading = state => state.auth.isLoading;
export const userType = state => state.auth.userType;
export default slice.reducer;
