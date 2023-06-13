import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { SearchPrediction } from "../../models/SearchPrediction";

const searchPredictionsPath = FileSystem.documentDirectory + "/searchPredictions.json";

const initialState: SearchPrediction[] = [];

export const searchPredictionsSlice = createSlice({
    name: "searchPredictions",
    initialState,
    reducers: {
        addSearchPrediction(state, action) {
            const newSearchPredictions = state.slice(-Math.max(state.length, 5));

            newSearchPredictions.push(action.payload);

            console.log({  newSearchPredictions });

            if(Platform.OS !== "web")
                FileSystem.writeAsStringAsync(searchPredictionsPath, JSON.stringify(newSearchPredictions));

            return newSearchPredictions;
        },

        
        setSearchPredictions(state, action) {
            if(Platform.OS !== "web")
                FileSystem.writeAsStringAsync(searchPredictionsPath, JSON.stringify(action.payload));

            return action.payload;
        }
    }
});

export async function readSearchPredictions(): Promise<SearchPrediction[]> {
    if(Platform.OS === "web")
        return initialState;

    const info = await FileSystem.getInfoAsync(searchPredictionsPath); 

    if(!info.exists)
        return [
            {
                name: "hey"
            }
        ];

    const content = await FileSystem.readAsStringAsync(searchPredictionsPath);
    const data = JSON.parse(content);

    console.log(data);

    return data;
}

export const { addSearchPrediction, setSearchPredictions } = searchPredictionsSlice.actions;
