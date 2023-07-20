import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { SearchPrediction } from "../../models/SearchPrediction";
import Client, { createRideTrackerClient } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";

const initialState: Client = createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, null);

export const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        setClient(state, action) {
            return action.payload;
        }
    }
});

export const { setClient } = clientSlice.actions;
