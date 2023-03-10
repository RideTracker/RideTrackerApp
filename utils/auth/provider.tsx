import React from "react";
import { useRouter, useSegments } from "expo-router";
import { Provider as ReduxProvider } from "react-redux";
import store from "../stores/store";

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
    const [user, setAuth] = React.useState(null);

    useProtectedRoute(user);

    return (
        <ReduxProvider store={store}>
            <AuthContext.Provider value={{
                    signIn: () => setAuth({}),
                    signOut: () => setAuth(null),
                    user
                }}>
                {children}
            </AuthContext.Provider>
        </ReduxProvider>
    );
};
