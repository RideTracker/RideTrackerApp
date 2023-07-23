import React, { ReactNode, useEffect, useState } from "react";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { useDispatch } from "react-redux";
import { readUserData, setUserData } from "../stores/userData";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../themes";
import { useUser } from "../../modules/user/useUser";
import Client, { StatusResponse, authenticateUser, createRideTrackerClient, getStatus } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import { readSearchPredictions, setSearchPredictions } from "../stores/searchPredictions";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { setClient } from "../stores/client";
import { useClient } from "../../modules/useClient";
import useInternetConnection from "../../modules/useInternetConnection";

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
    const internetConnection = useInternetConnection();

    const [ user, setAuth ] = useState(null);
    const [ ready, setReady ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<StatusResponse>(null);

    useEffect(() => {
        const client = createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, null);
        
        readUserData().then(async (data) => {
            if(data.email && data.token) {
                const client = createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                    identity: data.email,
                    key: data.token.key,
                    type: "Basic"
                });

                const authentication = await authenticateUser(client);

                dispatch(setClient(createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                    identity: data.email,
                    key: authentication.token.key,
                    type: "Basic"
                })));

                dispatch(setUserData({
                    email: data.email,
                    token: authentication.token,
                    user: authentication.user
                }));
            }
        }).catch(() => {
            dispatch(setUserData({
                key: undefined,
                user: undefined
            }));
        }).finally(() => {
            getStatus(client, Platform.OS).then((result) => {
                setStatus(result);
            }).finally(() => {
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
        if(!ready || !router)
            return;
            
        const inAuthGroup = segments.includes("(auth)");
        const inPublicGroup = segments.includes("(public)");
        const inSubscriptionGroup = segments.includes("(subscription)");

        if(internetConnection === "OFFLINE") {
            if(inSubscriptionGroup)
                router.push("/feed");
            else if(!inAuthGroup && !inPublicGroup)
                router.push("/feed");
        }
        else {
            if((!userData?.token || !client.token) && inAuthGroup)
                router.push("/login");
            else if ((userData?.token && client.token)) {
                if((!inAuthGroup && segments[segments.length - 1] !== "register") && !inPublicGroup) 
                    router.replace("/feed");
                else if(inSubscriptionGroup && !userData.user?.subscribed)
                    router.replace("/feed");
            }
        }
    }, [ router, ready, userData?.token, segments, client.token ]);

    useEffect(() => {
        if(ready) {
            getStatus(client, Platform.OS).then((result) => {
                if(result.success) {
                    if(result.supersededBy) {
                        if(!userData.updateTimeout || Date.now() >= userData.updateTimeout) {
                            router.push("/update");
                        }
                    }
                }
            });
        }
    }, [ ready ]);

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
