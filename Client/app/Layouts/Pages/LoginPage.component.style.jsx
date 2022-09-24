import { StyleSheet } from "react-native";
import Constants from "expo-constants";

import Appearance from "../Data/Appearance";

export default class LoginPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            backgroundColor: Appearance.theme.colorPalette.primary,

            flexDirection: "column",
            justifyContent: "flex-start",

            header: {
                color: Appearance.theme.colorPalette.secondary,

                fontSize: 32,
                fontWeight: "bold",
                textAlign: "center",

                margin: 32
            },

            footer: {
                margin: 24,

                marginBottom: Constants.statusBarHeight
            },

            text: {
                textAlign: "center",
                marginTop: 12,

                color: Appearance.theme.colorPalette.secondary,

                link: {
                    color: Appearance.theme.colorPalette.route
                }
            },

            form: {
                flex: 1,

                padding: 12,

                justifyContent: "center",

                input: {
                    marginBottom: 12
                },

                button: {
                    width: "100%",
                    height: 44,

                    marginBottom: 12,
                },

                divider: {
                    marginTop: 24 + -4,
                    marginBottom: 24,
                    
                    marginLeft: 5,
                    marginRight: 5,

                    flexDirection: "row",

                    alignItems: "center",

                    line: {
                        flex: 1,
                        
                        height: 1,

                        backgroundColor: Appearance.theme.colorPalette.accent
                    },

                    text: {
                        width: 50,

                        textAlign: "center",

                        fontSize: 14,
                        
                        color: Appearance.theme.colorPalette.secondary
                    }
                }
            }
        });

        return this;
    };
};
