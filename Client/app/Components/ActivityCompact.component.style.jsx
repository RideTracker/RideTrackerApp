import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class ActivityCompactStyle {
    static update() {
        this.sheet = StyleSheet.create({
            marginTop: 12,

            backgroundColor: Appearance.theme.colorPalette.primary,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.accent,
            
            borderTopWidth: 1,
            borderTopColor: Appearance.theme.colorPalette.accent,

            map: {
                height: 200,

                view: {
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%"
                }
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

                        fontWeight: "bold",
                        fontSize: 18
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontSize: 16
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

                padding: 12,
                paddingLeft: 80,

                item: {

                    justifyContent: "space-between",
                    alignItems: "center",

                    title: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontWeight: "bold",
                        fontSize: 26,
                        
                        textShadowColor: "#000",
                        textShadowOffset: {
                            width: 0,
                            height: 0
                        },

                        textShadowRadius: 4
                    },

                    unit: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontSize: 16,
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontSize: 16,
                        
                        textShadowColor: "rgba(0, 0, 0, .5)",
                        textShadowOffset: {
                            width: 0,
                            height: 0
                        },

                        textShadowRadius: 2
                    }
                }
            }
        });

        return this;
    };
};
