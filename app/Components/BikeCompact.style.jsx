import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class BikeCompactStyle {
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

            image: {
                width: 140,
                height: 100,

                marginRight: 12
            },

            grid: {
                flex: 1,
                flexDirection: "row"
            },

            text: {
                color: Appearance.theme.colorPalette.secondary,
                fontSize: 16,

                marginVertical: 6,
            }
        });

        return this;
    };
};
