import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RouteCompactStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flexDirection: "row",

            map: {
                height: 90,
                aspectRatio: 16 / 9,

                backgroundColor: "black"
            },

            grid: {
                flex: 1,
                flexDirection: "row",
                width: "100%",

                stretch: {
                    flex: 1
                }
            },

            text: {
                color: Appearance.theme.colorPalette.secondary,
                fontSize: 18,

                width: "100%",
                alignSelf: "stretch",

                marginVertical: 6,
            },

            stats: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",

                item: {
                    flexDirection: "column",

                    justifyContent: "center",

                    title: {
                        color: Appearance.theme.colorPalette.secondary,
                        fontSize: 16,

                        textAlign: "center",
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,
                        fontSize: 14,

                        textAlign: "center",
                    }
                }
            },

            button: {
                flexDirection: "column",

                justifyContent: "center",
                
                icon: {
                    marginRight: 24,

                    fontSize: 16,
                    color: Appearance.theme.colorPalette.secondary,

                    textAlign: "center"
                }
            }
        });

        return this;
    };
};
