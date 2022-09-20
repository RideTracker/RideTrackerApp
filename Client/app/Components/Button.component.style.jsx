import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class ButtonStyle {
    static update() {
        this.sheet = StyleSheet.create({
            backgroundColor: Appearance.theme.colorPalette.button,

            margin: 12,
            marginBottom: 6,
            marginTop: 6,
            padding: 12,

            borderRadius: 5,

            text: {
                color: Appearance.theme.colorPalette.foreground,

                fontWeight: "bold",
                fontSize: 18,

                textAlign: "center"
            },

            confirm: {
                backgroundColor: "transparent",
                
                text: {
                    color: "#850000"
                }
            }
        });
    };
};
