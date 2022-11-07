import { StyleSheet } from "react-native";

import Appearance from "app/Data/Appearance";

export default class {
    static update() {
        this.sheet = StyleSheet.create({
            notifications: {
                position: "absolute",
                
                width: "100%",
                
                bottom: 70,

                padding: 6,

                flexDirection: "column",

                item: {
                    marginTop: 12,
                    borderRadius: 4,

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,

                    elevation: 10,
                    
                    backgroundColor: Appearance.theme.colorPalette.accent,

                    paddingVertical: 8,
                    paddingHorizontal: 12,

                    text: {
                        fontSize: 16,
                        
                        color: Appearance.theme.colorPalette.secondary
                    }
                }
            }
        });

        return this;
    };
};
