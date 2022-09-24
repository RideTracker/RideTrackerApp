import { StyleSheet } from "react-native";

import Appearance from "../../Data/Appearance";

export default class SettingsPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,

            height: "100%",

            section: {
                marginTop: 12,
                marginBottom: 12,

                padding: 12,

                backgroundColor: Appearance.theme.colorPalette.primary,
                borderTopColor: Appearance.theme.colorPalette.accent,
                borderBottomColor: Appearance.theme.colorPalette.accent,

                borderTopWidth: 1,
                borderBottomWidth: 1,

                title: {
                    color: Appearance.theme.colorPalette.secondary,
                    fontWeight: "bold",
                    fontSize: 24
                },

                select: {
                    option: {
                        marginTop: 12,
                        marginBottom: 12,

                        title: {
                            color: Appearance.theme.colorPalette.secondary,
                            fontWeight: "bold",
                            fontSize: 16
                        },

                        description: {
                            color: Appearance.theme.colorPalette.secondary
                        }
                    }
                }
            }
        });

        return this;
    };
};
