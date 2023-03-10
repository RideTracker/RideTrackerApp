import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {},
    reducers: {
        setUserData(state, action) {
            return action.payload;
        },
    },
});

export const { setUserData } = userDataSlice.actions;
