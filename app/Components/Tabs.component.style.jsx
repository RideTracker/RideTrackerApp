import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            flex: 1,
            
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
            }
        });

        return this;
    };
};
