import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            width: "100%",
            height: "100%",

            close: {
                backgroundColor: "rgba(0, 0, 0, .5)",

                width: "100%",

                flex: 1
            },

            container: {
                backgroundColor: Appearance.theme.colorPalette.primary,

                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,

                width: "100%"
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

            advisory: {
                color: Appearance.theme.colorPalette.secondary,

                padding: 12,
                paddingTop: 6,
                paddingBottom: 6
            },

            write: {                
                padding: 12,

                flexDirection: "row",
                
                position: "relative",
                
                marginRight: 40 + 6,

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
                    position: "relative"
                },

                submit: {
                    width: 40,
                    height: 40,

                    justifyContent: "center",
                    alignItems: "center",

                    icon: {
                        color: Appearance.theme.colorPalette.accent,
                        fontSize: 24,

                        left: 5,
                        top: 1,

                        show: {
                            color: Appearance.theme.colorPalette.secondary
                        }
                    }
                }
            },

            comment: {
                marginTop: 12,

                padding: 12,
                paddingTop: 6,
                paddingBottom: 6,

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
                        paddingLeft: 12,

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
