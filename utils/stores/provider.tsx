import React, { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import store from "../stores/store";

type ProviderProps = {
    children: ReactNode;
};

export function Provider(props: ProviderProps) {
    const { children } = props;

    return (
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    );
}
