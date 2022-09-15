import { StyleSheet } from "react-native";

import Config from "../config.json";

export default StyleSheet.create({
    height: 70,
    width: "100%",

    backgroundColor: Config.colorPalette.section,
    
    borderTopWidth: 1,
    borderTopColor: Config.colorPalette.border,

    container: {
        flex: 1,
        flexDirection: "row",

        button: {
            height: 60,

            flex: 1,
            alignItems: "center",
            justifyContent: "center",

            icon: {
                color: "#F1F1F1",
    
                fontSize: 20,            
            },

            text: {
                color: "#FFF",

                marginTop: 4,
    
                fontSize: 14,
    
                textAlign: "center"
            }
        }
    }
});
