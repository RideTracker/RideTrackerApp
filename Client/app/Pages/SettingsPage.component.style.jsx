import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class SettingsPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,

            height: "100%",

            section: {
                marginTop: 12,
                marginBottom: 12,

                padding: 12,

                backgroundColor: Appearance.theme.colorPalette.section,
                borderTopColor: Appearance.theme.colorPalette.border,
                borderBottomColor: Appearance.theme.colorPalette.border,

                borderTopWidth: 1,
                borderBottomWidth: 1,

                title: {
                    color: Appearance.theme.colorPalette.highlight,
                    fontWeight: "bold",
                    fontSize: 24
                },

                select: {
                    option: {
                        marginTop: 12,
                        marginBottom: 12,

                        title: {
                            color: Appearance.theme.colorPalette.highlight,
                            fontWeight: "bold",
                            fontSize: 16
                        },

                        description: {
                            color: Appearance.theme.colorPalette.foreground
                        }
                    }
                }
            }
        });

        return this;
    };
};
