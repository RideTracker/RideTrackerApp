import { StyleSheet, Appearance } from "react-native";

import Config from "../config.json";

const config = Config[(Appearance.getColorScheme() == "dark")?("dark"):("default")];

export default StyleSheet.create({
    marginTop: 12,

    backgroundColor: config.colorPalette.section,
    
    borderBottomWidth: 1,
    borderBottomColor: config.colorPalette.border,
    
    borderTopWidth: 1,
    borderTopColor: config.colorPalette.border,

    map: {
        height: 200
    },

    user: {
        flex: 1,
        flexDirection: "row",
        
        padding: 12,

        image: {
            width: 40,
            height: 40,

            borderRadius: 50,

            marginRight: 12
        },

        texts: {
            flex: 1,
            flexDirection: "column",

            justifyContent: "center",

            title: {
                color: config.colorPalette.highlight,

                fontWeight: "bold",
                fontSize: 18
            },

            description: {
                color: config.colorPalette.foreground,

                fontSize: 16
            }
        }
    },
    
    stats: {
        position: "relative",

        marginTop: 12,

        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",

        item: {
            width: "50%",
            height: 80,

            justifyContent: "center",
            alignItems: "center",

            title: {
                color: config.colorPalette.highlight,

                fontWeight: "bold",
                fontSize: 26
            },

            description: {
                color: config.colorPalette.foreground,

                fontSize: 16
            }
        }
    }
});
