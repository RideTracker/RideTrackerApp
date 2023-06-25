import React, { ReactNode, useEffect } from "react";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { useDispatch } from "react-redux";
import { readUserData, setUserData } from "../stores/userData";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../themes";
import { useUser } from "../../modules/user/useUser";
import Client, { authenticateUser } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import { readSearchPredictions, setSearchPredictions } from "../stores/searchPredictions";
import * as NavigationBar from "expo-navigation-bar";

const AuthContext = React.createContext(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

function useProtectedRoute() {
    const segments = useSegments();
    const router = useRouter();

    const userData = useUser();

    React.useEffect(() => {
        const inAuthGroup = segments.includes("(auth)");

        if(!userData?.key && inAuthGroup)
            router.replace("/login");
        //else if (userData?.key && !inAuthGroup)
            //router.replace("/");
    }, [userData?.key, segments]);
}

type ProviderProps = {
    children: ReactNode;
};

export function Provider(props: ProviderProps) {
    const { children } = props;

    const dispatch = useDispatch();

    const theme = useTheme();

    const [user, setAuth] = React.useState(null);
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
        readUserData().then(async (data) => {
            dispatch(setUserData(data));

            if(data.key) {
                const client = new Client(Constants.expoConfig.extra.api, data.key);
                const authentication = await authenticateUser(client);

                dispatch(setUserData({
                    key: authentication.key,
                    user: authentication.user
                }));
            }

            setReady(true);
        }).catch(() => {
            dispatch(setUserData({
                key: undefined,
                user: undefined
            }));

            setReady(true);
        });

        readSearchPredictions().then(async (data) => {
            console.log({ data });

            dispatch(setSearchPredictions(data));
        })
    }, []);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(theme.background);
    }, [ theme ]);

    useProtectedRoute();

    if(!ready)
        return (<SplashScreen/>);

    return (
        <AuthContext.Provider value={{
            signIn: () => setAuth({}),
            signOut: () => setAuth(null),
            user
        }}>
            {children}

            <StatusBar style={theme.contrastStyle}/>
        </AuthContext.Provider>
    );
}
