import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { ParagraphText } from "./texts/paragraph";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CaptionText } from "./texts/caption";
import { useTheme } from "../utils/themes";

type TabsProps = {
    initialTab: string;
    style?: any;
    children?: any;
    onChange?: Function;
    pointerEvents?: any;
};

export default function Tabs({ initialTab, style, children, onChange, pointerEvents = "auto" }: TabsProps) {
    const theme = useTheme();
    const [ tab, setTab ] = useState(initialTab);

    useEffect(() => {
        if(onChange)
            onChange(tab);
    }, [ tab ]);

    return (
        <View style={style} pointerEvents={pointerEvents}>
            <View style={{
                flexDirection: "row",

                borderBottomColor: theme.placeholder,
                borderBottomWidth: 2,

                paddingHorizontal: 10,

                gap: 5
            }}>
                {React.Children.map(children, (child, index) => (
                    <TouchableOpacity key={index} style={{
                        padding: 10,
                        paddingVertical: 15,

                        marginBottom: -2,

                        borderBottomColor: (tab === child.props.id)?(theme.color):(theme.placeholder),
                        borderBottomWidth: 2
                    }} onPress={() => setTab(child.props.id)}>
                        <CaptionText style={{
                            fontSize: 18,
                            opacity: (tab === child.props.id)?(1):(0.6)
                        }}>
                            {child.props.title}
                        </CaptionText>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ paddingBottom: 50 }}>
                {children.find((child) => child.props.id === tab)}
            </View>
        </View>
    );
};

type TabsPageProps = {
    id: string;
    title: any;
    style?: any;
    children?: any;
};

export function TabsPage({ style, children }: TabsPageProps) {
    return (
        <View style={style}>
            {children}
        </View>
    );
};
