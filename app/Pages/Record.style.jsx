import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RecordPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            backgroundColor: Appearance.theme.colorPalette.primary,

            position: "absolute",

            left: 0,
            top: 0,

            flex: 1,

            height: "100%",
            width: "100%",

            directions: {
                //backgroundColor: "#397E49",

                flexDirection: "row",

                padding: 6,
                margin: 12,
                borderRadius: 4,

                /*shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,

                elevation: 10,*/

                upcoming: {
                    minWidth: 60,

                    justifyContent: "center",
                    alignItems: "center",

                    marginRight: 24,

                    image: {
                        tintColor: "#FFF",

                        width: 50,
                        height: 50
                    },

                    text: {
                        fontWeight: "bold",
                        fontSize: 24,
                        color: Appearance.theme.colorPalette.secondary
                    },

                    unit: {
                        fontSize: 16,
                        color: Appearance.theme.colorPalette.secondary
                    }
                },

                street: {
                    flexDirection: "column",
                    justifyContent: "center",

                    flex: 1,

                    text: {
                        fontSize: 20,
                        fontWeight: "bold",
                        color: Appearance.theme.colorPalette.secondary
                    },

                    instruction: {
                        fontSize: 16,
                        color: Appearance.theme.colorPalette.secondary
                    }
                }
            },

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
                marginTop: "auto",

                section: {
                    backgroundColor: Appearance.theme.colorPalette.primary
                }
            },

            stats: {
                justifyContent: "space-evenly",

                overlay: {
                    height: 100
                },

                row: {
                    flexDirection: "row",
                    justifyContent: "space-evenly",

                    marginVertical: 12,

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
                padding: 6,

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

            warning: {
                margin: 12,

                title: {
                    fontWeight: "bold",
                    fontSize: 18,
    
                    color: Appearance.theme.colorPalette.secondary
                },

                description: {
                    fontSize: 16,
    
                    color: Appearance.theme.colorPalette.secondary
                }
            },

            buttons: {
                margin: 12
            }
        });

        return this;
    };
};
