import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const userDataPath = FileSystem.documentDirectory + "/userData.json";

export const userDataSlice = createSlice({
    name: "userData",
    initialState: {},
    reducers: {
        setUserData(state, action) {
            const newData = {
                ...state,
                ...action.payload
            };

            if(Platform.OS !== "web")
                FileSystem.writeAsStringAsync(userDataPath, JSON.stringify(newData));

            return newData;
        }
    }
});

export async function readUserData() {
    if(Platform.OS === "web")
        return {};

    const info = await FileSystem.getInfoAsync(userDataPath); 

    if(!info.exists)
        return {};

    const content = await FileSystem.readAsStringAsync(userDataPath);
    const data = JSON.parse(content);

    console.log(data);

    return data;
}

export const { setUserData } = userDataSlice.actions;
