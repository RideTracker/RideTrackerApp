import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class ButtonStyle {
    static update() {
        this.sheet = StyleSheet.create({
            backgroundColor: Appearance.theme.colorPalette.accent,

            justifyContent: "center",
            height: 44,

            borderRadius: 5,

            branded: {
                backgroundColor: Appearance.theme.colorPalette.route
            },

            text: {
                color: Appearance.theme.colorPalette.secondary,

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
