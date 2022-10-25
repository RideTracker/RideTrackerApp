import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class InputStyle {
    static update() {
        this.sheet = StyleSheet.create({
            flexDirection: "row",

            backgroundColor: Appearance.theme.colorPalette.primary,

            width: "100%",
            height: 44,

            border: {  
                borderRadius: 6,
    
                borderColor: Appearance.theme.colorPalette.border,
                borderWidth: 1,
            },

            icon: {

                justifyContent: "center",
                height: 44,
                width: 44,

                text: {
                    textAlign: "center",

                    fontSize: 18,
    
                    color: Appearance.theme.colorPalette.secondary,
                }
            },

            input: {
                width: "100%",
                fontSize: 18,

                color: Appearance.theme.colorPalette.secondary,
                
                height: 44
            }
        });

        return this;
    };
};
