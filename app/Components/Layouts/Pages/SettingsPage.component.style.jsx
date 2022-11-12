import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

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
                borderTopColor: Appearance.theme.colorPalette.border,
                borderBottomColor: Appearance.theme.colorPalette.border,

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
                },

                switch: {
                    marginTop: 12,
                    marginBottom: 12,

                    flexDirection: "row",

                    text: {
                        width: "80%",

                        title: {
                            color: Appearance.theme.colorPalette.secondary,
                            fontWeight: "bold",
                            fontSize: 16
                        },
    
                        description: {
                            color: Appearance.theme.colorPalette.secondary
                        },
                    },

                    button: {
                        width: "20%"
                    }
                }
            },
            
            website: {
                textAlign: "center",
                fontSize: 18.5,
                color: Appearance.theme.colorPalette.secondary
            },

            version: {
                textAlign: "center",
                fontSize: 11,
                color: Appearance.theme.colorPalette.secondary
            }
        });

        return this;
    };
};
