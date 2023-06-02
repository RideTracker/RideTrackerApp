import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { LayoutChangeEvent, View } from "react-native";
import { useTheme } from "../utils/themes";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../modules/user/useUser";
import { ParagraphText } from "./texts/Paragraph";

type ScrollViewFilterProps = {
    type: string;
    onChange: (text: string) => void;
    onLayout: (event: LayoutChangeEvent) => void;
};

export function ScrollViewFilter(props: ScrollViewFilterProps) {
    const { type, onChange, onLayout } = props;

    const theme = useTheme();
    const router = useRouter();
    const userData = useUser();

    const [ text, setText ] = useState<string>("");
    const [ count, setCount ] = useState<number>(userData.filters?.[type]?.length ?? 0);

    useEffect(() => {
        setCount(userData.filters?.[type]?.length ?? 0);
    }, [ userData.filters?.[type] ]);

    return (
        <View style={{
            height: 55,
        
            flexDirection: "row",
            alignItems: "center",
            gap: 10,

            paddingBottom: 10
        }} onLayout={(event) => onLayout(event)}>
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

            <TouchableOpacity style={{ padding: 5, position: "relative" }} onPress={() => router.push(`/filter/${type}`)}>
                {(count)?(
                    <React.Fragment>
                        <FontAwesome name="filter" size={24} color={theme.color}/>

                        <View style={{
                            position: "absolute",

                            right: 0,
                            bottom: 0,

                            width: 16,
                            height: 16,

                            justifyContent: "center",
                            alignItems: "center",

                        }}>
                            <ParagraphText>{count}</ParagraphText>
                        </View>
                    </React.Fragment>
                ):(
                    <Feather name="filter" size={24} color={theme.color}/>
                )}
            </TouchableOpacity>
        </View>
    );
}
