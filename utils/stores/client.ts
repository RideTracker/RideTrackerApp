import { createSlice } from "@reduxjs/toolkit";
import Client from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";

export const clientSlice = createSlice({
    name: "client",
    initialState: {},
    reducers: {
        setClient(state, action) {
            return {};
        }
    }
});

export const { setClient } = clientSlice.actions;
