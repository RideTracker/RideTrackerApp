import Constants from "expo-constants";

import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class HeaderStyle {
    static update() {
        this.sheet = StyleSheet.create({
            width: "100%",

            position: "relative",

            backgroundColor: Appearance.theme.colorPalette.common,

            paddingTop: Constants.statusBarHeight,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.border,

            branded: {
                backgroundColor: Appearance.theme.colorPalette.route,
                borderBottomWidth: 0,

                wave: {
                    height: 80,
                    
                    backgroundColor: Appearance.theme.colorPalette.primary,

                    fill: Appearance.theme.colorPalette.route
                }
            },

            transparent: {
                backgroundColor: "transparent",
                borderBottomWidth: 0
            },

            feed: {
                color: Appearance.theme.colorPalette.secondary,

                fontWeight: "bold",
                fontSize: 26,

                padding: 12,

                textAlign: "center"
            },

            button: {
                justifyContent: "center",
                
                marginRight: 24,

                icon: {
                    color: Appearance.theme.colorPalette.secondary,
                    
                    fontSize: 26,
                }
            },

            buttons: {
                flexDirection: "row",
                    
                marginLeft: 24,

                position: "absolute",

                top: Constants.statusBarHeight + 16,
                right: 0
            }
        });

        return this;
    };
};
