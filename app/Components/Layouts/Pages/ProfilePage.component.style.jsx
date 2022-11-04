import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class ProfilePageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,

            height: "100%",

            backgroundColor: Appearance.theme.colorPalette.background,

            profile: {
                avatar: {
                    width: "100%",

                    flexDirection: "row",
                    justifyContent: "center",

                    image: {
                        width: 100,
                        height: 100,
        
                        borderRadius: 100,
                        borderWidth: 2,
                        borderColor: Appearance.theme.colorPalette.border,                
                    }
                },

                title: {
                    color: Appearance.theme.colorPalette.secondary,

                    textAlign: "center",

                    fontSize: 24
                },

                follow: {
                    color: Appearance.theme.colorPalette.route,

                    textAlign: "center",

                    fontSize: 14
                },

                item: {
                    paddingTop: 6,
                    paddingBottom: 6,
                }
            },

            tabs: {
                flexDirection: "row",

                borderBottomWidth: 1,
                borderBottomColor: Appearance.theme.colorPalette.border,

                tab: {
                    text: {
                        color: Appearance.theme.colorPalette.secondary,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
    
                        fontSize: 18
                    },

                    active: {
                        borderBottomWidth: 2,
                        borderBottomColor: Appearance.theme.colorPalette.route
                    }
                }
            },

            section: {
                paddingVertical: 6,

                item: {
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                },

                title: {
                    color: Appearance.theme.colorPalette.secondary,
                    paddingHorizontal: 12,

                    fontSize: 22
                },
            },

            button: {
                marginHorizontal: 12,
                marginVertical: 6
            }
        });

        return this;
    };
};
