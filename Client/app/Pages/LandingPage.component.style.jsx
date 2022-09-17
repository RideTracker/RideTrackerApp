import { StyleSheet } from "react-native";

import Config from "../config.json";

export default StyleSheet.create({
    container: {
        flex: 1,
        
        position: "relative",

        page: {
            backgroundColor: Config.colorPalette.background,

            position: "absolute",

            width: "100%",
            height: "100%",

            left: 0,
            top: 0
        }
    },

    content: {
        height: "100%",

        activity: {
			marginTop: 50
		}
    }
});