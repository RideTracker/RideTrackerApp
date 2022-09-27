import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RecordPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            marginTop: 12,

            backgroundColor: Appearance.theme.colorPalette.primary,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.accent,
            
            borderTopWidth: 1,
            borderTopColor: Appearance.theme.colorPalette.accent,

            map: {
                height: 200
            },

            user: {
                flex: 1,
                flexDirection: "row",
                
                padding: 12,

                image: {
                    width: 40,
                    height: 40,

                    borderRadius: 50,

                    marginRight: 12
                },

                texts: {
                    flex: 1,
                    flexDirection: "column",

                    justifyContent: "center",

                    title: {
                        color: Appearance.theme.colorPalette.secondary,

                        ...Appearance.styles.activity.user.title
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,

                        ...Appearance.styles.activity.user.description
                    }
                }
            },
            
            stats: {
                position: "relative",

                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",

                item: {
                    width: "50%",
                    height: 80,

                    justifyContent: "center",
                    alignItems: "center",

                    title: {
                        color: Appearance.theme.colorPalette.secondary,

                        ...Appearance.styles.activity.stats.value
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,

                        ...Appearance.styles.activity.stats.key
                    }
                }
            }
        });

        return this;
    };
};
