import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class ErrorStyle {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            content: {
                flex: 1,

                justifyContent: "center",
                alignItems: "center",
                width: "80%",

                marginLeft: "auto",
                marginRight: "auto"
            },

            icon: {
                color: Appearance.theme.colorPalette.route,
                marginVertical: 6,

                fontSize: 64
            },

            title: {
                color: Appearance.theme.colorPalette.route,
                marginVertical: 6,

                fontSize: 24,
                fontWeight: "bold"
            },

            description: {
                color: Appearance.theme.colorPalette.route,
                marginVertical: 6,

                fontSize: 16
            },

            light: {
                color: Appearance.theme.colorPalette.route
            },

            darker: {
                color: Appearance.theme.colorPalette.routeDarker
            }
        });

        return this;
    };
};
