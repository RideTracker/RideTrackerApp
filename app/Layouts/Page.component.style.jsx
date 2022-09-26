import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class PageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            height: "100%",
            backgroundColor: Appearance.theme.colorPalette.background,
            position: "relative"
        });

        return this;
    };
};
