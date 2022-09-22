import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class ButtonStyle {
    static update() {
        this.sheet = StyleSheet.create({
            backgroundColor: Appearance.theme.colorPalette.accent,

            margin: 12,
            marginBottom: 6,
            marginTop: 6,
            padding: 12,

            borderRadius: 5,

            text: {
                color: Appearance.theme.colorPalette.secondary,

                fontWeight: "bold",
                fontSize: 18,

                textAlign: "center"
            },
            

            noMargin: {
                margin: 0
            },

            confirm: {
                backgroundColor: "transparent",
                
                text: {
                    color: "#850000"
                }
            }
        });

        return this;
    };
};
