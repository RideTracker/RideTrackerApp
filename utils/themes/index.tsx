import { useColorScheme } from "react-native";

import config from "./config.json";

export function useTheme(scheme?: string) {
    const colorScheme = useColorScheme();
    const userData = useUser();

    try {
        if(!userData?.token)
            return config["dark"];

        return config[scheme ?? userData?.theme ?? colorScheme];
    }
    catch {
        return config[scheme ?? colorScheme];
    }
}

import mapStyle from "./mapStyle.json";
import { useUser } from "../../modules/user/useUser";
import { useSegments } from "expo-router";

export function useMapStyle() {
    return mapStyle;
}
