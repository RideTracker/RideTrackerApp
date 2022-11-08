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
                    borderRadius: 10,

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,

                    elevation: 10,

                    borderWidth: 1,
                    borderColor: Appearance.theme.colorPalette.border,
                    
                    backgroundColor: Appearance.theme.colorPalette.routeDarker,

                    paddingVertical: 8,
                    paddingHorizontal: 12,

                    flexDirection: "row",

                    text: {
                        fontSize: 16,
                        
                        color: Appearance.theme.colorPalette.secondary
                    },

                    icon: {
                        fontSize: 16,

                        color: Appearance.theme.colorPalette.secondary,

                        justifyContent: "center",

                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "auto"
                    }
                }
            }
        });

        return this;
    };
};
