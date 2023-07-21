import React, { useState, useEffect, ReactNode, ReactElement } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CaptionText } from "./texts/Caption";
import { useTheme } from "../utils/themes";

type TabsProps = {
    initialTab: string;
    style?: ViewStyle;
    children?: ReactElement[];
    onChange?: (string) => void;
    pointerEvents?: "auto" | "box-none" | "none" | "box-only";
};

export default function Tabs({ initialTab, style, children, onChange, pointerEvents = "auto" }: TabsProps) {
    const theme = useTheme();
    const [ tab, setTab ] = useState(initialTab);

    useEffect(() => {
        if(onChange)
            onChange(tab);
    }, [ tab ]);

    return (
        <View style={{
            flexDirection: "column",
            flex: 1,
            
            ...style
        }} pointerEvents={pointerEvents}>
            <View>
                <ScrollView horizontal={true} style={{ overflow: "visible" }}>
                    <View style={{
                        flexDirection: "row",

                        paddingHorizontal: 10,
                        
                        borderBottomColor: theme.placeholder,                        
                        borderBottomWidth: 2,

                        minWidth: "100%"
                    }}>
                        {React.Children.map(children, (child, index) => (
                            <TouchableOpacity key={index} style={{
                                padding: 10,
                                paddingVertical: 15,

                                paddingHorizontal: 15,

                                marginBottom: -2,

                                borderBottomColor: (tab === child?.props?.id)?(theme.color):(theme.placeholder),
                                borderBottomWidth: 2
                            }} onPress={() => setTab(child?.props?.id)}>
                                <CaptionText style={{
                                    fontSize: 18,
                                    opacity: (tab === child?.props?.id)?(1):(0.6)
                                }}>
                                    {child?.props?.title}
                                </CaptionText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <View style={{ flexGrow: 1, position: "relative" }}>
                <View style={{ position: "absolute", width: "100%", height: "100%" }}>
                    {children.find((child) => child?.props?.id === tab)}
                </View>
            </View>
        </View>
    );
}

type TabsPageProps = {
    id: string;
    title: string;
    style?: ViewStyle;
    children?: ReactNode;
};

export function TabsPage({ style, children }: TabsPageProps) {
    return (
        <View style={style}>
            {children}
        </View>
    );
}
