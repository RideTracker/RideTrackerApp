import { configureStore } from "@reduxjs/toolkit";
import { userDataSlice } from "./userData";
import { clientSlice } from "./client";

const store = configureStore({
    reducer: {
        userData: userDataSlice.reducer,
        client: clientSlice.reducer
    }
});

export default store;
