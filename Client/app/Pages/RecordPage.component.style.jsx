import { StyleSheet } from "react-native";

import Config from "../config.json";

export default StyleSheet.create({
    backgroundColor: Config.colorPalette.section,

    height: "100%",

    paddingBottom: 20,

    map: {
        height: 200
    },

    stats: {
        flex: 1,

        justifyContent: "space-evenly",

        row: {
            flexDirection: "row",
            justifyContent: "space-evenly"
        },

        container: {
            position: "relative"
        },

        column: {
            title: {
                color: Config.colorPalette.highlight,

                fontWeight: "bold",
                fontSize: 26
            },

            description: {
                color: Config.colorPalette.foreground,

                fontSize: 16
            }
        },
        
        item: {
            title: {
                color: Config.colorPalette.highlight,
                
                fontSize: 46,
                fontWeight: "bold",
                textAlign: "center"
            },

            description: {
                color: Config.colorPalette.foreground,
                
                fontSize: 26,
                textAlign: "center"
            }
        },

        wide: {
            title: {
                fontSize: 80
            },

            text: {
                color: Config.colorPalette.foreground,

                fontSize: 26,
                fontWeight: "normal",
                textAlign: "center",

                hidden: {
                    color: "transparent"
                }
            }
        },

        high: {
            title: {
                fontSize: 100
            }
        }
    },

    controls: {
        padding: 32,

        flexDirection: "row",

        justifyContent: "space-evenly",

        container: {
            flexDirection: "row"
        },  

        button: {
            position: "relative",

            marginLeft: 12,
            marginRight: 12,

            icon: {
                color: Config.colorPalette.foreground,
                
                fontSize: 70,
            },
            
            container: {
                position: "absolute",

                top: 0,
                bottom: 0, 

                left: 0,
                right: 0,
                
                justifyContent: "center",
                alignItems: "center"
            },
            
            text: {
                color: Config.colorPalette.foreground,
                
                fontSize: 14,
                fontWeight: "bold"
            }
        }
    }
});
