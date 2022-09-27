import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            backgroundColor: Appearance.theme.colorPalette.primary,

            form: {
                padding: 12,

                text: {
                    color: Appearance.theme.colorPalette.secondary,
                    fontSize: 18
                },

                description: {
                    color: Appearance.theme.colorPalette.secondary,
                    fontSize: 12
                },

                input: {
                    marginBottom: 12
                },

                multiInput: {
                    flexDirection: "row",

                    input: {
                        position: "relative",
                        width: "50%"
                    }
                },

                divider: {
                    height: 1,
                    width: "100%",
                    
                    backgroundColor: Appearance.theme.colorPalette.accent,

                    marginTop: 12,
                    marginBottom: 12,
                }
            }
        });

        return this;
    };
};
