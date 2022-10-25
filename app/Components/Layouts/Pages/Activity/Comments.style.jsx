import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            width: "100%",
            height: "100%",

            close: {
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "20%"
            },

            background: {
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%",

                backgroundColor: "rgba(0, 0, 0, .5)"
            },

            container: {
                position: "absolute",

                top: 0,
                left: 0,

                width: "100%",
                height: "100%",
            },

            content: {
                backgroundColor: Appearance.theme.colorPalette.primary,

                position: "absolute",

                top: "20%",
                left: 0,

                width: "100%",
                height: "100%",

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            },

            header: {
                color: Appearance.theme.colorPalette.secondary,

                fontWeight: "bold",
                fontSize: 20,

                padding: 12,

                count: {
                    color: Appearance.theme.colorPalette.secondary,

                    fontSize: 18,
                    fontWeight: "normal"
                }
            },

            borders: {
                borderTopColor: Appearance.theme.colorPalette.border,
                borderTopWidth: 1,

                borderBottomColor: Appearance.theme.colorPalette.border,
                borderBottomWidth: 1,

            },

            write: {                
                padding: 12,

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
                        justifyContent: "center",
                        
                        color: Appearance.theme.colorPalette.secondary,
                        fontSize: 16
                    }
                }
            },

            comment: {
                marginTop: 12,

                padding: 12,
                paddingTop: 6,
                paddingBottom: 6,

                flexDirection: "row",

                child: {
                    paddingLeft: 0,
                    paddingRight: 0
                },

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

                    reply: {
                        color: Appearance.theme.colorPalette.route,

                        marginTop: 6,

                        fontSize: 14,
                    },

                    author: {
                        color: Appearance.theme.colorPalette.secondary,

                        fontSize: 16,
                        fontWeight: "bold"
                    },

                    time: {
                        paddingLeft: 8,

                        color: Appearance.theme.colorPalette.secondary,
                        fontSize: 14,
                        fontWeight: "normal"
                    }
                }
            }
        });

        return this;
    };
};
