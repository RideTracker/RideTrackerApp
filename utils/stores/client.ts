import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
    name: "client",
    initialState: {},
    reducers: {
        setClient() {
            return {};
        }
    }
});

export const { setClient } = clientSlice.actions;
