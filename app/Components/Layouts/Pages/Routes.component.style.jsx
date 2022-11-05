import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RoutesStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,

            height: "100%",

            
            map: {
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%"
            },

            grid: {
                marginTop: "auto"
            },

            footer: {
                marginLeft: "auto",

                flexDirection: "row",

                padding: 12
            },


            playground: {
                backgroundColor: "red",

                width: "100%",
                height: "100%"
            },

            instructions: {
                flexDirection: "column",

                padding: 12,

                title: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 16,
                },

                description: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 14,
                }
            },

            button: {
                minWidth: 80,

                icon: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 24,

                    textAlign: "center"
                },

                text: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 14,

                    textAlign: "center"
                }
            }
        });

        return this;
    };
};
