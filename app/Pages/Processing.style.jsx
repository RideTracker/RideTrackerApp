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

            backgroundColor: "rgba(0, 0, 0, .5)",

            justifyContent: "center",

            text: {
                textAlign: "center",

                fontSize: 20,

                color: Appearance.theme.colorPalette.secondary
            }
        });

        return this;
    };
};
