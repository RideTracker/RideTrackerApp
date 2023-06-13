import { configureStore } from "@reduxjs/toolkit";
import { userDataSlice } from "./userData";
import { clientSlice } from "./client";
import { searchPredictionsSlice } from "./searchPredictions";

const store = configureStore({
    reducer: {
        client: clientSlice.reducer,
        userData: userDataSlice.reducer,
        searchPredictions: searchPredictionsSlice.reducer
    }
});

export default store;
