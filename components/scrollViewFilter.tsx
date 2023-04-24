import React from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useThemeConfig } from "../utils/themes";
import { FontAwesome } from '@expo/vector-icons';

export function ScrollViewFilter() {
    const themeConfig = useThemeConfig();

    return (
        <View style={{
            height: 45,
        
            paddingHorizontal: 10,

            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <View style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                
                backgroundColor: themeConfig.border,
                    
                height: 35,

                paddingHorizontal: 10,

                borderRadius: 10
            }}>
                <FontAwesome name="search" size={17} color={themeConfig.color}/>

                <TextInput style={{
                    flex: 1,

                    color: themeConfig.color,

                    fontSize: 15,
                    fontWeight: "500"
                }} placeholder="Search..." placeholderTextColor={themeConfig.color}/>
            </View>

            <TouchableOpacity style={{ padding: 5 }}>
                <FontAwesome name="filter" size={24} color={themeConfig.color}/>
            </TouchableOpacity>
        </View>
    )
};
