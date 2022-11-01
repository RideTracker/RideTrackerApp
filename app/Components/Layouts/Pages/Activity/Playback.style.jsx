import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            width: "100%",
            height: "100%",

            left: 0,
            top: 0,
            
            backgroundColor: Appearance.theme.colorPalette.primary,

            header: {
                position: "absolute",
    
                width: "100%",
                height: "100%",
    
                left: 0,
                top: 0
            },

            map: {
                backgroundColor: Appearance.theme.colorPalette.primary,
                
                position: "absolute",
    
                width: "100%",
                height: "100%",
    
                left: 0,
                top: 0
            },

            overlay: {
                position: "absolute",
    
                width: "100%",
    
                left: 0,
                bottom: 0,

                flexDirection: "column",

                graph: {
                    marginVertical: 12,
                },

                stats: {
                    width: "100%",

                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",

                    marginVertical: 12,

                    item: {
                        width: "30%",
                        
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
            }
        });

        return this;
    };
};
