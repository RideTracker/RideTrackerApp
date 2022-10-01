import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            backgroundColor: "rgba(0, 0, 0, .5)",

            width: "100%",
            height: "100%",

            container: {
                backgroundColor: Appearance.theme.colorPalette.primary,

                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,

                position: "absolute",

                width: "100%",

                bottom: 0
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
        });

        return this;
    };
};
