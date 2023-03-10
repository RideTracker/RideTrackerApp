import React, { useEffect } from "react";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { useDispatch, Provider as ReduxProvider } from "react-redux";
import store from "../stores/store";
import { readUserData, setUserData } from "../stores/userData";

const AuthContext = React.createContext(null);

export function useAuth() {
    return React.useContext(AuthContext);
};

function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    React.useEffect(() => {
        const inAuthGroup = segments.includes("(auth)");

        if (!user && inAuthGroup)
            router.replace("/login");
        else if (user && !inAuthGroup)
            router.replace("/");
    }, [user, segments]);
};

export function Provider({ children }) {
    const dispatch = useDispatch();

    const [user, setAuth] = React.useState(null);
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
        readUserData().then((data) => {
            dispatch(setUserData(data));

            setReady(true);
        });
    }, []);

    useProtectedRoute(user);

    if(!ready)
        return (<SplashScreen/>);

    return (
        <AuthContext.Provider value={{
                signIn: () => setAuth({}),
                signOut: () => setAuth(null),
                user
            }}>
            {children}
        </AuthContext.Provider>
    );
};
