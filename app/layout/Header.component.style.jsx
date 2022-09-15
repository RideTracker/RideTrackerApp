import { StyleSheet } from "react-native";
import Constants from "expo-constants";

import Config from "../config.json";

export default StyleSheet.create({
    width: "100%",

    position: "relative",

    backgroundColor: Config.colorPalette.section,

    paddingTop: Constants.statusBarHeight,
    
    borderBottomWidth: 1,
    borderBottomColor: Config.colorPalette.border,

    feed: {
        color: "#FFF",

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
            color: Config.colorPalette.foreground,
            
            fontSize: 26,
            
            marginLeft: 24,
            marginRight: 24
        }
    },

    navigation: {
        right: 0
    }
});
