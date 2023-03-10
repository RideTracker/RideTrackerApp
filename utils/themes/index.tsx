import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useColorScheme } from "react-native";

import config from "./config.json";

export function useThemeConfig() {
    const colorScheme = useColorScheme();

    try {
        const userData = useSelector((state: any) => state.userData);

        return config[userData?.theme ?? colorScheme];
    }
    catch {
        return config[colorScheme];
    }
};

import mapStyle from "./mapStyle.json";

export function useMapStyle() {
    return mapStyle;
};
