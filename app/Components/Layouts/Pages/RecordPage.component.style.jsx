import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RecordPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            backgroundColor: Appearance.theme.colorPalette.primary,

            position: "relative",

            height: "100%",

            map: {
                height: "100%",
                width: "100%",

                position: "absolute",

                left: 0,
                top: 0
            },

            mapCompact: {
                flex: 1,
            },

            footer: {
                marginTop: "auto"
            },

            stats: {
                justifyContent: "space-evenly",

                overlay: {
                    height: 100
                },

                row: {
                    flexDirection: "row",
                    justifyContent: "space-evenly",

                    marginTop: 24,

                    item: {
                        width: "50%"
                    }
                },

                container: {
                    position: "relative"
                },

                column: {
                    width: "50%",

                    justifyContent: "center",
                    alignItems: "center",
                    
                    title: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontWeight: "bold",
                        fontSize: 26
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontSize: 16
                    }
                },
                
                item: {
                    title: {
                        color: Appearance.theme.colorPalette.secondary,
                        
                        fontSize: 46,
                        fontWeight: "bold",
                        textAlign: "center"
                    },

                    description: {
                        color: Appearance.theme.colorPalette.secondary,
                        
                        fontSize: 26,
                        textAlign: "center"
                    }
                },

                wide: {
                    title: {
                        fontSize: 80
                    },

                    text: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontSize: 26,
                        fontWeight: "normal",
                        textAlign: "center",

                        hidden: {
                            color: "transparent"
                        }
                    }
                },

                high: {
                    title: {
                        fontSize: 100
                    }
                }
            },

            controls: {
                padding: 32,

                flexDirection: "row",

                justifyContent: "space-evenly",

                container: {
                    flexDirection: "row"
                },  

                button: {
                    position: "relative",

                    marginLeft: 12,
                    marginRight: 12,

                    icon: {
                        color: Appearance.theme.colorPalette.secondary,
                        
                        fontSize: 70,
                    },

                    iconSide: {
                        marginTop: "auto",
                        marginBottom: 12,

                        color: Appearance.theme.colorPalette.secondary,
                        
                        fontSize: 24,
                    },

                    iconSideInvisible: {
                        marginTop: "auto",
                        marginBottom: 12,

                        opacity: 0,

                        color: Appearance.theme.colorPalette.secondary,
                        
                        fontSize: 24,
                    },
                    
                    container: {
                        position: "absolute",

                        top: 0,
                        bottom: 0, 

                        left: 0,
                        right: 0,
                        
                        justifyContent: "center",
                        alignItems: "center"
                    },
                    
                    text: {
                        color: Appearance.theme.colorPalette.secondary,
                        
                        fontSize: 14,
                        fontWeight: "bold"
                    }
                }
            },

            buttons: {
                margin: 12
            }
        });

        return this;
    };
};
