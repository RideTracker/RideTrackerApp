import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useColorScheme } from "react-native";

import config from "./config.json";

export function useTheme() {
    const colorScheme = useColorScheme();

    try {
        const userData = useUser();

        return config[userData?.theme ?? colorScheme];
    }
    catch {
        return config[colorScheme];
    }
};

import mapStyle from "./mapStyle.json";
import { useUser } from "../../modules/user/useUser";

export function useMapStyle() {
    return mapStyle;
};
