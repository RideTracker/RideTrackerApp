import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class FilterPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            height: "100%",
            width: "100%",

            position: "absolute",

            left: 0,
            top: 0,

            flex: 1,

            overlay: {
                height: "100%",
                width: "100%",
    
                position: "absolute",
    
                left: 0,
                top: 0,

                backgroundColor: "rgba(0, 0, 0, .5)"
            },

            content: {
                marginTop: "auto",

                backgroundColor: Appearance.theme.colorPalette.background,

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,

                paddingVertical: 6,
                paddingHorizontal: 12
            }
        });

        return this;
    };
};
