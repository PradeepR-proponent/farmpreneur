import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'user',
    initialState: {
        userdata:{}
    },
    reducers: {
        UPDATE_USER: (state, action) => {
            state.userdata = action.payload.user;
        },
        DELETE_USER: state => {
            state.userdata = {};
        },
    },
});

export const {UPDATE_USER,DELETE_USER} = slice.actions;
export const userData = state => state.user.userdata;
export default slice.reducer;
