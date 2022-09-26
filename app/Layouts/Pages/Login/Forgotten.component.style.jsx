import { StyleSheet } from "react-native";

import Appearance from "../../../Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            backgroundColor: Appearance.theme.colorPalette.primary
        });

        return this;
    };
};
