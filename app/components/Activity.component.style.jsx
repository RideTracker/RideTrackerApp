import { StyleSheet } from "react-native";

import Config from "../config.json";

export default StyleSheet.create({
    marginTop: 12,

    backgroundColor: Config.colorPalette.section,
    
    borderBottomWidth: 1,
    borderBottomColor: Config.colorPalette.border,
    
    borderTopWidth: 1,
    borderTopColor: Config.colorPalette.border,

    map: {
        height: 300,

        position: "relative",

        image: {
            width: "100%",
            height: "100%"
        },

        user: {
            position: "absolute",

            flex: 1,
            flexDirection: "row",
            
            bottom: 0,

            width: "100%",

            padding: 12,

            backgroundColor: "rgba(28, 28, 28, 1)",

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
                    color: Config.colorPalette.highlight,

                    fontWeight: "bold",
                    fontSize: 18
                },

                description: {
                    color: Config.colorPalette.foreground,

                    fontSize: 16
                }
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
                color: Config.colorPalette.highlight,

                fontWeight: "bold",
                fontSize: 26
            },

            description: {
                color: Config.colorPalette.foreground,

                fontSize: 16
            }
        }
    }
});
