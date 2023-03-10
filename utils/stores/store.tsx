import { configureStore } from "@reduxjs/toolkit";
import { userDataSlice } from "./userData";

const store = configureStore({
    reducer: {
        userData: userDataSlice.reducer
    }
});

export default store;
