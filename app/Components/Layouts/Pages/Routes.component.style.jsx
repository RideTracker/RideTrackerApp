import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RoutesStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,

            height: "100%",
            width: "100%",

            backgroundColor: Appearance.theme.colorPalette.background,

            flexDirection: "column",
            
            map: {
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%"
            },

            grid: {
                marginTop: "auto"
            },

            footer: {
                flexDirection: "row",

                marginLeft: "auto",

                padding: 12,
                //marginBottom: 24,

                disregard: {
                    flexDirection: "row",
                    
                    marginLeft: "auto"
                }
            },


            playground: {
                backgroundColor: "red",

                width: "100%",
                height: "100%"
            },

            instructions: {
                flexDirection: "column",

                padding: 12,

                title: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 16,
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                },

                description: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 14,
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                }
            },

            button: {
                minWidth: 80,

                icon: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 24,

                    textAlign: "center",
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                },

                text: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 14,

                    textAlign: "center",
                    textShadowColor: Appearance.theme.colorPalette.background,
                    textShadowOffset: {
                        width: 0,
                        height: 0
                    },
                    textShadowRadius: 4,
                }
            },

            stats: {
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",

                padding: 8,

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
            },

            dynamic: {
                flex: 1,
                height: "auto"
            },

            static: {
                borderTopWidth: 1,
                borderTopColor: Appearance.theme.colorPalette.border,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,

                routes: {
                    maxHeight: 300
                },

                content: {
                    padding: 12
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
