import React, { useEffect } from "react";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { useDispatch, Provider as ReduxProvider, useSelector } from "react-redux";
import store from "../stores/store";
import { readUserData, setUserData } from "../stores/userData";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../themes";
import { useUser } from "../../modules/user/useUser";
import { authenticateUser } from "../../controllers/auth/authenticateUser";
import { setClient } from "../stores/client";

const AuthContext = React.createContext(null);

export function useAuth() {
    return React.useContext(AuthContext);
};

function useProtectedRoute(user) {
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
};

export function Provider({ children }) {
    const dispatch = useDispatch();

    const theme = useTheme();

    const [user, setAuth] = React.useState(null);
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
        readUserData().then(async (data) => {
            dispatch(setUserData(data));

            if(data.key) {
                const authentication = await authenticateUser(data.key);
                
                dispatch(setUserData({
                    key: authentication.key,
                    user: authentication.user
                }));

                dispatch(setClient(authentication.key));
            }

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

            <StatusBar style={theme.contrastStyle}/>
        </AuthContext.Provider>
    );
};
