import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useTheme } from "../utils/themes";
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";

type ScrollViewFilterProps = {
    type: string;
    onChange: (text: string) => void;
};

export function ScrollViewFilter(props: ScrollViewFilterProps) {
    const { type, onChange } = props;

    const theme = useTheme();
    const router = useRouter();

    const [ text, setText ] = useState<string>("");

    return (
        <View style={{
            height: 45,
        
            paddingHorizontal: 10,

            flexDirection: "row",
            alignItems: "center",
            gap: 10,

            paddingTop: 10
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
                }} placeholder="Search..." placeholderTextColor={theme.color} value={text} onEndEditing={() => onChange(text)} onChangeText={(text) => setText(text)}/>

                {(!!text.length) && (
                    <TouchableOpacity onPress={() => {
                        setText("");
                        onChange("");
                    }}>
                        <FontAwesome name="times" size={17} color={theme.color}/>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity style={{ padding: 5 }} onPress={() => router.push(`/filter/${type}`)}>
                <FontAwesome name="filter" size={24} color={theme.color}/>
            </TouchableOpacity>
        </View>
    )
};
