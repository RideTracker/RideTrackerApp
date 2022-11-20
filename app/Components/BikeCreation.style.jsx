import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class BikeCreationStyle {
    static update() {
        this.sheet = StyleSheet.create({
            section: {
                marginHorizontal: 12
            },

            image: {
                width: "100%",
                aspectRatio: 16 / 9,
                
                marginVertical: 12,
                borderRadius: 6
            },

            placeholder: {
                width: "100%",
                aspectRatio: 16 / 9,

                marginVertical: 12,

                borderWidth: 3,
                borderColor: Appearance.theme.colorPalette.border,
                borderRadius: 12,
                borderStyle: "dashed",

                justifyContent: "center",
                alignItems: "center",

                icon: {
                    color: Appearance.theme.colorPalette.border,

                    fontSize: 64
                }
            },

            form: {
                marginVertical: 6,

                text: {
                    color: Appearance.theme.colorPalette.secondary,
                    fontSize: 18
                },

                description: {
                    color: Appearance.theme.colorPalette.secondary,
                    fontSize: 12
                },

                input: {
                    marginVertical: 6,
                },

                grid: {
                    flexDirection: "row",

                    input: {
                        position: "relative",
                        width: "50%",

                        marginVertical: 6,
                        marginRight: 6
                    }
                },

                buttom: {
                    justifyContent: "flex-end"
                }
            }
        });

        return this;
    };
};
