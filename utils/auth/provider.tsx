import React, { ReactNode, useEffect, useState } from "react";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { useDispatch } from "react-redux";
import { readUserData, setUserData } from "../stores/userData";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../themes";
import { useUser } from "../../modules/user/useUser";
import Client, { StatusResponse, authenticateUser, createClient, getStatus } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import { readSearchPredictions, setSearchPredictions } from "../stores/searchPredictions";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { setClient } from "../stores/client";
import { useClient } from "../../modules/useClient";

const AuthContext = React.createContext(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

type ProviderProps = {
    children: ReactNode;
};

SplashScreen.preventAutoHideAsync();

export function Provider(props: ProviderProps) {
    const { children } = props;

    const dispatch = useDispatch();

    const theme = useTheme();
    const router = useRouter();
    const segments = useSegments();
    const userData = useUser();
    const client = useClient();

    const [ user, setAuth ] = useState(null);
    const [ ready, setReady ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<StatusResponse>(null);

    useEffect(() => {
        const client = createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api);
        
        getStatus(client, Platform.OS).then((result) => {
            setStatus(result);

            readUserData().then(async (data) => {
                if(data.email && data.token) {
                    const client = createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                        email: data.email,
                        key: data.token.key
                    });

                    const authentication = await authenticateUser(client);
    
                    dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                        email: data.email,
                        key: authentication.token.key
                    })));

                    dispatch(setUserData({
                        email: data.email,
                        token: authentication.token,
                        user: authentication.user
                    }));
                }
    
                setReady(true);

                SplashScreen.hideAsync();
            }).catch(() => {
                dispatch(setUserData({
                    key: undefined,
                    user: undefined
                }));
    
                setReady(true);

                SplashScreen.hideAsync();
            });
        });

        readSearchPredictions().then(async (data) => {
            console.log({ data });

            dispatch(setSearchPredictions(data));
        })
    }, []);

    if(Platform.OS === "android") {
        useEffect(() => {
            NavigationBar.setBackgroundColorAsync(theme.background);
        }, [ theme ]);
    }

    useEffect(() => {
        if(!ready)
            return;
            
        const inAuthGroup = segments.includes("(auth)");

        if((!userData?.token || !client.token) && inAuthGroup)
            router.replace("/login");
        else if ((userData?.token && client.token) && !inAuthGroup)
            router.replace("/");
    }, [ userData?.token, segments, client.token ]);

    if(!ready)
        return null;

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
