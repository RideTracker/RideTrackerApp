import { StyleSheet, Appearance } from "react-native";
import Constants from "expo-constants";

import Config from "../config.json";

const config = Config[(Appearance.getColorScheme() == "dark")?("dark"):("default")];

export default StyleSheet.create({
    width: "100%",

    position: "relative",

    backgroundColor: config.colorPalette.section,

    paddingTop: Constants.statusBarHeight,
    
    borderBottomWidth: 1,
    borderBottomColor: config.colorPalette.border,

    feed: {
        color: config.colorPalette.highlight,

        fontWeight: "bold",
        fontSize: 26,

        padding: 12,

        textAlign: "center"
    },

    button: {
        position: "absolute",

        top: Constants.statusBarHeight,

        bottom: 0,
        
        justifyContent: "center",

        icon: {
            color: config.colorPalette.foreground,
            
            fontSize: 26,
            
            marginLeft: 24,
            marginRight: 24
        }
    },

    navigation: {
        right: 0
    }
});
