import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class LandingPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            container: {
                flex: 1,
                
                position: "relative",

                page: {
                    backgroundColor: Appearance.theme.colorPalette.background,

                    position: "absolute",

                    width: "100%",
                    height: "100%",

                    left: 0,
                    top: 0
                }
            },

            content: {
                height: "100%",

                activity: {
                    marginTop: 50
                }
            }
        });

        return this;
    };
};
