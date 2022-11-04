import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class BikeCompactStyle {
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

            image: {
                width: "40%",
                aspectRatio: 16 / 9,

                marginRight: 12
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
