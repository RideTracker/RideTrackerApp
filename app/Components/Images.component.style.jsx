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

            dots: {
                position: "absolute",

                width: "100%",
                
                padding: 12,

                left: 0,
                bottom: 0,

                justifyContent: "center",
                flexDirection: "row",

                dot: {
                    backgroundColor: Appearance.theme.colorPalette.secondary,

                    opacity: .5,

                    marginRight: 6,
                    marginLeft: 6,

                    width: 18,
                    height: 18,

                    borderRadius: 25
                },

                selected: {
                    opacity: .75
                }
            }
        });

        return this;
    };
};
