import { useColorScheme } from "react-native";

import config from "./config.json";

export function useThemeConfig() {
    const colorScheme = useColorScheme();

    return config[colorScheme];
};
