import { StyleSheet, Appearance } from "react-native";

import Config from "../config.json";

const config = Config[(Appearance.getColorScheme() == "dark")?("dark"):("default")];

export default StyleSheet.create({
    height: 70,
    width: "100%",

    backgroundColor: config.colorPalette.section,
    
    borderTopWidth: 1,
    borderTopColor: config.colorPalette.border,

    container: {
        flex: 1,
        flexDirection: "row",

        button: {
            height: 60,

            flex: 1,
            alignItems: "center",
            justifyContent: "center",

            icon: {
                color: config.colorPalette.foreground,
    
                fontSize: 20,            
            },

            text: {
                color: config.colorPalette.highlight,

                marginTop: 4,
    
                fontSize: 14,
    
                textAlign: "center"
            }
        }
    }
});
