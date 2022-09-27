import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class ActivityCompactStyle {
    static update() {
        this.sheet = StyleSheet.create({
            position: "relative",
            
            marginTop: 6,
            marginBottom: 6,

            backgroundColor: Appearance.theme.colorPalette.primary,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.accent,
            
            borderTopWidth: 1,
            borderTopColor: Appearance.theme.colorPalette.accent,

            clickable: {
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%",

                pressing: {
                    backgroundColor: "rgba(0, 0, 0, .25)"
                }
            },

            map: {
                height: 180,

                view: {
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%"
                }
            },

            button: {
                marginLeft: 12,
                marginRight: 12,
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
                position: "absolute",
                width: "100%",
                
                bottom: 0,

                marginTop: 12,

                flex: 2,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",

                padding: 8,
                paddingLeft: 80,

                item: {

                    justifyContent: "space-between",
                    alignItems: "center",

                    title: {
                        color: Appearance.theme.colorPalette.secondary,
                        
                        textShadowColor: Appearance.theme.colorPalette.background,
                        textShadowOffset: {
                            width: 0,
                            height: 0
                        },

                        textShadowRadius: 4,

                        ...Appearance.styles.activity.stats.value
                    },

                    unit: {
                        color: Appearance.theme.colorPalette.secondary,

                        ...Appearance.styles.activity.stats.unit
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,
                        
                        textShadowColor: "rgba(0, 0, 0, .5)",
                        textShadowOffset: {
                            width: 0,
                            height: 0
                        },

                        textShadowRadius: 2,

                        ...Appearance.styles.activity.stats.key
                    }
                }
            }
        });

        return this;
    };
};
