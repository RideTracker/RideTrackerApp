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
                content: {
                    paddingTop: Constants.statusBarHeight,
                    width: "100%",

                    backgroundColor: Appearance.theme.colorPalette.route,

                    flexDirection: "row",
                    
                    icon: {
                        width: 100,
                        height: 100,

                        marginTop: 24,
                        marginBottom: 24,
                    },

                    text: {
                        
                        marginTop: 24,
                        marginBottom: 24,
                        paddingRight: 24,
                    },

                    title: {
                        fontSize: 20,
                        fontWeight: "bold",
                        color: Appearance.theme.colorPalette.solid,
                    },

                    description: {
                        color: Appearance.theme.colorPalette.solid,
                    }
                },

                svg: {
                    marginTop: -20,
                    height: 80,

                    fill: Appearance.theme.colorPalette.route
                }
            },

            form: {
                flex: 2,

                padding: 12,

                input: {
                    backgroundColor: Appearance.theme.colorPalette.primary,
                    
                    borderRadius: 6,

                    padding: 12,

                    fontSize: 18,

                    marginBottom: 12,

                    borderColor: Appearance.theme.colorPalette.accent,
                    borderWidth: 1,

                    color: Appearance.theme.colorPalette.secondary,

                    width: "100%",
                    height: 44
                },

                button: {
                    width: "100%",
                    height: 44
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
