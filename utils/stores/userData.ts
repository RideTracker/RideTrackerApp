import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { User } from "../../models/User";

const userDataPath = FileSystem.documentDirectory + "/userData.json";

const initialState: User = {
    filters: {},
    mapProvider: "google"
};

export const userDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        setUserData(state, action) {
            const newUser: User = {
                ...state,
                ...action.payload
            };

            if(Platform.OS !== "web")
                FileSystem.writeAsStringAsync(userDataPath, JSON.stringify(newUser));

            return newUser;
        }
    }
});

export async function readUserData(): Promise<User> {
    if(Platform.OS === "web")
        return initialState;

    const info = await FileSystem.getInfoAsync(userDataPath); 

    if(!info.exists)
        return initialState;

    const content = await FileSystem.readAsStringAsync(userDataPath);
    const data = JSON.parse(content);

    console.log(data);

    return data;
}

export const { setUserData } = userDataSlice.actions;
