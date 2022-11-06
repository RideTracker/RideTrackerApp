import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RouteCompactStyle {
    static update() {
        this.sheet = StyleSheet.create({
            position: "relative",
            
            marginTop: 6,
            marginBottom: 6,

            backgroundColor: Appearance.theme.colorPalette.primary,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.border,
            
            borderTopWidth: 1,
            borderTopColor: Appearance.theme.colorPalette.border,

            flexDirection: "row",

            map: {
                height: 100,
                aspectRatio: 16 / 9,

                backgroundColor: "black"
            }
        });

        return this;
    };
};
