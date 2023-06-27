import React, { ReactNode, useEffect, useState } from "react";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { useDispatch } from "react-redux";
import { readUserData, setUserData } from "../stores/userData";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../themes";
import { useUser } from "../../modules/user/useUser";
import Client, { StatusResponse, authenticateUser, getStatus } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import { readSearchPredictions, setSearchPredictions } from "../stores/searchPredictions";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

const AuthContext = React.createContext(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

type ProviderProps = {
    children: ReactNode;
};

export function Provider(props: ProviderProps) {
    const { children } = props;

    const dispatch = useDispatch();

    const theme = useTheme();
    const router = useRouter();
    const segments = useSegments();
    const userData = useUser();

    const [ user, setAuth ] = useState(null);
    const [ ready, setReady ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<StatusResponse>(null);

    useEffect(() => {
        const client = new Client(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api);
        
        getStatus(client, Platform.OS).then((result) => {
            setStatus(result);

            readUserData().then(async (data) => {
                if(data.key) {
                    const client = new Client(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, data.key);
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

        if(!userData?.key && inAuthGroup)
            router.replace("/login");
        else if (userData?.key && !inAuthGroup)
            router.replace("/");
    }, [ userData?.key, segments ]);

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
