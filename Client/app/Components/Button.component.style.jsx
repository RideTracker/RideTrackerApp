import { StyleSheet, Appearance } from "react-native";

import Config from "../config.json";

const config = Config[(Appearance.getColorScheme() == "dark")?("dark"):("default")];

export default StyleSheet.create({
    backgroundColor: config.colorPalette.button,

    margin: 12,
    marginBottom: 6,
    marginTop: 6,
    padding: 12,

    borderRadius: 5,

    text: {
        color: config.colorPalette.foreground,

        fontWeight: "bold",
        fontSize: 18,

        textAlign: "center"
    },

    confirm: {
        backgroundColor: "transparent",
        
        text: {
            color: "#850000"
        }
    }
});