import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class BikeCompactStyle {
    static update() {
        this.sheet = StyleSheet.create({
            height: "100%",
            width: "100%",

            position: "absolute",

            left: 0,
            top: 0,

            backgroundColor: Appearance.theme.colorPalette.background,
        });

        return this;
    };
};
