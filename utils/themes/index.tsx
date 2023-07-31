import { useColorScheme } from "react-native";

import config from "./config.json";

const themes: { [key: string]: Theme } = {};

Object.entries(config).forEach((item) => {
    const keys = item[1];

    console.log("Creating theme " + item[0]);

    themes[item[0]] = {
        background: keys.background,
        color: keys.color,
        placeholder: keys.placeholder,
        highlight: keys.highlight,
        border: keys.border,
    
        red: keys.red,
        orange: keys.orange,
    
        brand: keys.brand,
        brandText: keys.brandText,

        variants: {
            background: new Color(keys.background),
            color: new Color(keys.color),
            placeholder: new Color(keys.placeholder),
            highlight: new Color(keys.highlight),
            border: new Color(keys.border),
        
            red: new Color(keys.red),
            orange: new Color(keys.orange),
        
            brand: new Color(keys.brand),
            brandText: new Color(keys.brandText)
        },
    
        contrast: keys.contrast as "black" | "white",
        contrastStyle: keys.contrastStyle as "dark" | "light",
    
        mapStyle: keys.mapStyle,
        mapStyleFullscreen: keys.mapStyleFullscreen
    };
})

export function useTheme(scheme?: string) {
    const colorScheme = useColorScheme();
    const userData = useUser();

    try {
        if(!userData?.token)
            return themes["dark"];

        return themes[scheme ?? userData?.theme ?? colorScheme];
    }
    catch {
        return themes[scheme ?? colorScheme];
    }
}

import mapStyle from "./mapStyle.json";
import { useUser } from "../../modules/user/useUser";
import { Theme } from "../../models/Theme";
import Color from "../../models/Color";

export function useMapStyle() {
    return mapStyle;
}
