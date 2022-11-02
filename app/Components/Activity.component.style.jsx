import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class RecordPageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            height: "100%",
            width: "100%",

            position: "absolute",

            left: 0,
            top: 0,

            backgroundColor: Appearance.theme.colorPalette.background,

            section: {
                backgroundColor: Appearance.theme.colorPalette.primary,
                
                borderBottomWidth: 1,
                borderBottomColor: Appearance.theme.colorPalette.border,
                
                borderTopWidth: 1,
                borderTopColor: Appearance.theme.colorPalette.border,

                marginBottom: 12,

                header: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 18,
                    fontWeight: "bold",

                    count: {
                        fontSize: 16,
                        fontWeight: "normal"
                    }
                },

                padded: {                    
                    padding: 12,
                    paddingTop: 6,
                    paddingBottom: 6,
                }
            },

            comments: {
                write: {
                    marginTop: 12,
                    marginBottom: 6,

                    flexDirection: "row",
                    
                    position: "relative",

                    avatar: {
                        justifyContent: "center",

                        image: {
                            width: 35,
                            height: 35,
        
                            borderRadius: 50,
        
                            marginRight: 12,
                        }
                    },

                    content: {
                        justifyContent: "center",

                        text: {
                            color: Appearance.theme.colorPalette.secondary,
                            fontSize: 16,
                        }
                    }
                },

                snippet: {
                    marginTop: 12,
                    marginBottom: 6,

                    flexDirection: "row",

                    image: {
                        width: 35,
                        height: 35,
    
                        borderRadius: 50,
    
                        marginRight: 12,

                        justifyContent: "center"
                    },

                    content: {
                        position: "relative",

                        title: {
                            flexDirection: "row",

                            alignItems: "center"
                        },

                        description: {
                            color: Appearance.theme.colorPalette.secondary,

                            fontSize: 14,

                            // this fix sucks but react native css also sucks
                            paddingRight: 35 + 12
                        },

                        author: {
                            color: Appearance.theme.colorPalette.secondary,

                            fontSize: 16,
                            fontWeight: "bold"
                        },

                        time: {
                            paddingLeft: 12,

                            color: Appearance.theme.colorPalette.secondary,
                            fontSize: 14,
                            fontWeight: "normal"
                        }
                    }
                }
            },  

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
                },

                buttons: {
                    icon: {
                        color: Appearance.theme.colorPalette.secondary,
                        fontSize: 24
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
            },

            buttons: {
                position: "relative",

                flex: 1,
                flexDirection: "row",

                marginLeft: 6,
                marginRight: 6,

                button: {
                    padding: 12,

                    flexDirection: "row",
                    
                    icon: {
                        fontSize: 20,

                        color: Appearance.theme.colorPalette.secondary,

                        marginBottom: 2
                    },

                    label: {
                        paddingLeft: 12,

                        color: Appearance.theme.colorPalette.secondary,

                        fontSize: 16
                    }
                }
            }
        });

        return this;
    };
};
