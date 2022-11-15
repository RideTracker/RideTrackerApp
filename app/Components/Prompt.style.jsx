import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            height: "100%",
            width: "100%",

            position: "absolute",

            left: 0,
            top: 0,

            backgroundColor: Appearance.theme.colorPalette.background,

            background: {
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%"
            },

            container: {
                flex: 1,
            },
            
            content: {
                flex: 1,
                
                justifyContent: "center",

                padding: 12,
            },

            footer: {
                width: "100%",

                padding: 12,

                marginBottom: 6,

                button: {
                    marginTop: 12
                }
            },

            logo: {
                width: "80%",
                resizeMode: "contain",

                alignSelf: "center"
            },

            title: {
                color: Appearance.theme.colorPalette.secondary,

                fontSize: 18,

                marginBottom: 32,

                alignSelf: "center"
            },

            description: {
                color: Appearance.theme.colorPalette.secondary,

                fontSize: 16,

                marginVertical: 32
            }
        });

        return this;
    };
};
