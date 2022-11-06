import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RoutesStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,

            height: "100%",

            flexDirection: "column",
            
            map: {
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%"
            },

            grid: {
                marginTop: "auto"
            },

            footer: {
                flexDirection: "row",

                padding: 12,
                //marginBottom: 24,

                disregard: {
                    flexDirection: "row",
                    
                    marginLeft: "auto"
                }
            },


            playground: {
                backgroundColor: "red",

                width: "100%",
                height: "100%"
            },

            instructions: {
                flexDirection: "column",

                padding: 12,

                title: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 16,
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                },

                description: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 14,
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                }
            },

            button: {
                minWidth: 80,

                icon: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 24,

                    textAlign: "center",
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                },

                text: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 14,

                    textAlign: "center",
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                }
            },

            dynamic: {
                flex: 1,
                height: "auto"
            },

            static: {

                borderTopWidth: 1,
                borderTopColor: Appearance.theme.colorPalette.border,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
            }
        });

        return this;
    };
};
