import { StyleSheet } from "react-native";

import Appearance from "../../Data/Appearance";

export default class ProfilePageStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,

            height: "100%",

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
                        borderColor: Appearance.theme.colorPalette.accent,                
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
            }
        });

        return this;
    };
};
