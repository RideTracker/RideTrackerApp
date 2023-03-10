import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useColorScheme } from "react-native";

import config from "./config.json";

export function useThemeConfig() {
    const userData = useSelector((state: any) => state.userData);
    const colorScheme = useColorScheme();

    return config[userData?.theme ?? colorScheme];
};

import mapStyle from "./mapStyle.json";

export function useMapStyle() {
    return mapStyle;
};
