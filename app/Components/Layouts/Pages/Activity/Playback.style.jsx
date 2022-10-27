import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            position: "absolute",

            width: "100%",
            height: "100%",

            left: 0,
            top: 0,
            
            backgroundColor: Appearance.theme.colorPalette.primary,

            map: {
                backgroundColor: Appearance.theme.colorPalette.primary,
                
                position: "absolute",
    
                width: "100%",
                height: "100%",
    
                left: 0,
                top: 0
            }
        });

        return this;
    };
};
