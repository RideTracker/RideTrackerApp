import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class ProfileSettingsStyle {
    static update() {
        this.sheet = StyleSheet.create({
            backgroundColor: Appearance.theme.colorPalette.background,

            width: "100%",
            height: "100%"
        });

        return this;
    };
};
