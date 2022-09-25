import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class FooterStyle {
    static update() {
        this.sheet = StyleSheet.create({
            height: 70,
            width: "100%",

            backgroundColor: Appearance.theme.colorPalette.primary,
            
            borderTopWidth: 1,
            borderTopColor: Appearance.theme.colorPalette.accent,

            position: "relative",

            container: {
                flex: 1,
                flexDirection: "row",

                button: {
                    height: 60,

                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",

                    icon: {
                        color: Appearance.theme.colorPalette.secondary,
            
                        fontSize: 20,            
                    },

                    text: {
                        color: Appearance.theme.colorPalette.secondary,

                        marginTop: 4,
            
                        fontSize: 14,
            
                        textAlign: "center"
                    }
                }
            },

            appearance: {
                position: "absolute",
                bottom: "100%",

                width: "100%",
                
                backgroundColor: Appearance.theme.colorPalette.accent,

                padding: 12,

                text: {
                    color: Appearance.theme.colorPalette.secondary
                }
            }
        });

        return this;
    };
};
