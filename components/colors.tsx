import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useThemeConfig } from "../utils/themes";

const typeColors = [
    {
        type: "lips",
        colors: [
            "#EE7386", // pink
            "#FF0000", // red
            "#8B0000", // deep red
            "#FFB6C1", // light pink
            "#FF69B4", // dark pink
            "#FF7F50", // coral
            "#FFA500", // orange
            "#BA55D3", // mauve
            "#8B668B", // plum
            "#FFE4C4", // nude
            "#800080"  // berry
        ]
    },

    {
        type: "skin",
        colors: [
            "#FCE2C4", // light skin tone
            "#F8D1B9", // medium-light skin tone
            "#F1BEAC", // medium skin tone
            "#E8AE9E", // medium-dark skin tone
            "#D89E91", // dark skin tone
            "#C98E84", // very dark skin tone
            "#B97E77", // extra dark skin tone
            "#A96E6A", // deep skin tone
            "#986E64", // rich skin tone
            "#876D5E", // cocoa skin tone
            "#F0D9B5"  // olive skin tone
        ]
    },

    {
        type: "hair",
        colors: [
            "#000000", // black
            "#3B3024", // dark brown
            "#654321", // brown
            "#8B4513", // medium brown
            "#A52A2A", // auburn
            "#CD853F", // light brown
            "#FFD700", // blonde
            "#FFA500", // orange
            "#FF6347", // red
            "#FF69B4", // pink
            "#C71585"  // purple
        ]
    },

    {
        type: "eyes",
        colors: [
            "#000080", // dark blue
            "#1E90FF", // light blue
            "#006400", // dark green
            "#008000", // green
            "#556B2F", // hazel
            "#8B4513", // brown
            "#4B0082", // indigo
            "#483D8B", // dark violet
            "#9370DB", // medium purple
            "#FF69B4", // pink
            "#FFD700"  // golden
        ]
    },

    {
        type: "eyelashes",
        colors: [
            "#000000", // black
            "#3B3024", // dark brown
            "#654321", // brown
            "#8B4513", // medium brown
            "#A52A2A", // auburn
            "#CD853F", // light brown
            "#FFD700", // blonde
            "#FFA500", // orange
            "#FF6347", // red
            "#FF69B4", // pink
            "#C71585"  // purple
        ]
    },

    {
        type: "eyebrows",
        colors: [
            "#000000", // black
            "#3B3024", // dark brown
            "#654321", // brown
            "#8B4513", // medium brown
            "#A52A2A", // auburn
            "#CD853F", // light brown
            "#FFD700", // blonde
            "#FFA500", // orange
            "#FF6347", // red
            "#FF69B4", // pink
            "#C71585"  // purple
        ]
    },

    {
        type: "primary",
        colors: [
            "#F7D94C", // yellow
            "#FFA500", // orange
            "#FF6347", // coral
            "#FF69B4", // pink
            "#DA70D6", // orchid
            "#00BFFF", // deep sky blue
            "#4169E1", // royal blue
            "#2E8B57", // sea green
            "#228B22", // forest green
            "#A0522D", // sienna
            "#696969"  // dim gray
        ]
    },

    {
        type: "secondary",
        colors: [
            "#F7D94C", // yellow
            "#FFA500", // orange
            "#FF6347", // coral
            "#FF69B4", // pink
            "#DA70D6", // orchid
            "#00BFFF", // deep sky blue
            "#4169E1", // royal blue
            "#2E8B57", // sea green
            "#228B22", // forest green
            "#A0522D", // sienna
            "#696969"  // dim gray
        ]
    }
];

export function Colors({ initialColor, type }) {
    const themeConfig = useThemeConfig();

    return (
        <ScrollView horizontal={true}>
            <View style={{
                flexDirection: "row",
                gap: 10
            }}>
                <View style={{
                    width: 40,
                    height: 40,

                    borderWidth: 2,
                    borderColor: themeConfig.highlight,

                    borderRadius: 50,

                    backgroundColor: initialColor
                }}/>

                {typeColors.find((typeColor) => typeColor.type === type)?.colors?.map((color) => (
                    <View key={color} style={{
                        width: 40,
                        height: 40,

                        borderWidth: 2,
                        borderColor: themeConfig.border,

                        borderRadius: 50,

                        backgroundColor: color
                    }}/>
                ))}
            </View>
        </ScrollView>
    );
};
