import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { SearchPrediction } from "../../models/SearchPrediction";
import Client, { createClient } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";

const initialState: Client = createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api);

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
