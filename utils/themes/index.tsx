import { useColorScheme } from "react-native";

import config from "./config.json";

export function useTheme(scheme?: string) {
    const colorScheme = useColorScheme();

    try {
        const userData = useUser();

        return config[scheme ?? userData?.theme ?? colorScheme];
    }
    catch {
        return config[scheme ?? colorScheme];
    }
}

import mapStyle from "./mapStyle.json";
import { useUser } from "../../modules/user/useUser";

export function useMapStyle() {
    return mapStyle;
}
