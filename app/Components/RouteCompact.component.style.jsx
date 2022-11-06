import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RouteCompactStyle {
    static update() {
        this.sheet = StyleSheet.create({
            position: "relative",
            
            marginTop: 6,
            marginBottom: 6,

            backgroundColor: Appearance.theme.colorPalette.primary,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.border,
            
            borderTopWidth: 1,
            borderTopColor: Appearance.theme.colorPalette.border,

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
                justifyContent: "space-around",

                item: {
                    flexDirection: "column",

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
            }
        });

        return this;
    };
};
