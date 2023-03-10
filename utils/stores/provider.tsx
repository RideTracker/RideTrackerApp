import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import store from "../stores/store";

export function Provider({ children }) {
    return (
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    );
};
