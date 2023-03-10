import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";

const userDataPath = FileSystem.documentDirectory + "/userData.json";

export const userDataSlice = createSlice({
    name: "userData",
    initialState: {},
    reducers: {
        setUserData(state, action) {
            FileSystem.writeAsStringAsync(userDataPath, JSON.stringify(action.payload));

            return action.payload;
        }
    }
});

export async function readUserData() {
    const info = await FileSystem.getInfoAsync(userDataPath); 

    if(!info.exists)
        return {};

    const content = await FileSystem.readAsStringAsync(userDataPath);
    const data = JSON.parse(content);

    return data;
};

export const { setUserData } = userDataSlice.actions;
