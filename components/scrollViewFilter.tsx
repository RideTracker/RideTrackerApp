import React from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useTheme } from "../utils/themes";
import { FontAwesome } from '@expo/vector-icons';

export function ScrollViewFilter() {
    const theme = useTheme();

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
                
                backgroundColor: theme.border,
                    
                height: 35,

                paddingHorizontal: 10,

                borderRadius: 10
            }}>
                <FontAwesome name="search" size={17} color={theme.color}/>

                <TextInput style={{
                    flex: 1,

                    color: theme.color,

                    fontSize: 15,
                    fontWeight: "500"
                }} placeholder="Search..." placeholderTextColor={theme.color}/>
            </View>

            <TouchableOpacity style={{ padding: 5 }}>
                <FontAwesome name="filter" size={24} color={theme.color}/>
            </TouchableOpacity>
        </View>
    )
};
