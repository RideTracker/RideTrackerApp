import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class InputStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flexDirection: "row",

            backgroundColor: Appearance.theme.colorPalette.primary,

            width: "100%",
            height: 44,
                
            borderRadius: 6,

            borderColor: Appearance.theme.colorPalette.accent,
            borderWidth: 1,

            icon: {

                justifyContent: "center",
                height: 44,
                width: 44,

                text: {
                    textAlign: "center",

                    fontSize: 18,
    
                    color: Appearance.theme.colorPalette.secondary,
                }
            },

            input: {
                fontSize: 18,

                color: Appearance.theme.colorPalette.secondary,
                
                height: 44
            }
        });

        return this;
    };
};
