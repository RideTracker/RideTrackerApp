import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "relative",

            width: "100%",
            height: "100%",

            images: {
                position: "relative",

                width: "100%",
                height: "100%",

                image: {
                    position: "absolute",

                    top: 0,

                    width: "100%",
                    height: "100%"
                }
            },

            button: {
                position: "absolute",
                top: 0,

                height: "100%",

                justifyContent: "center",

                padding: 12,

                text: {
                    color: Appearance.theme.colorPalette.secondary,
                    fontSize: 24,
                },

                previous: {
                    left: 0
                },

                next: {
                    right: 0
                }
            },

            dots: {
                position: "absolute",

                width: "100%",
                
                padding: 12,

                left: 0,
                bottom: 0,

                justifyContent: "center",
                flexDirection: "row",

                dot: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 12,

                    opacity: .75,

                    marginRight: 6,
                    marginLeft: 6
                },

                selected: {
                    opacity: 1
                }
            }
        });

        return this;
    };
};
