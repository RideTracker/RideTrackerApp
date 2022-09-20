import { StyleSheet, Appearance } from "react-native";

import Config from "../config.json";

const config = Config[(Appearance.getColorScheme() == "dark")?("dark"):("default")];

export default StyleSheet.create({
    flex: 1,

    height: "100%",

    section: {
        marginTop: 12,
        marginBottom: 12,

        padding: 12,

        backgroundColor: config.colorPalette.section,
        borderTopColor: config.colorPalette.border,
        borderBottomColor: config.colorPalette.border,

        borderTopWidth: 1,
        borderBottomWidth: 1,

        title: {
            color: config.colorPalette.highlight,
            fontWeight: "bold",
            fontSize: 24
        },

        select: {
            option: {
                marginTop: 12,
                marginBottom: 12,

                title: {
                    color: config.colorPalette.highlight,
                    fontWeight: "bold",
                    fontSize: 16
                },

                description: {
                    color: config.colorPalette.foreground
                }
            }
        }
    }
});
