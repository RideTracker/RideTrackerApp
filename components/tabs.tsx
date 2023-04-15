import React, { useState } from "react";
import { Text, View } from "react-native";
import { ParagraphText } from "./texts/paragraph";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CaptionText } from "./texts/caption";
import { useThemeConfig } from "../utils/themes";

type TabsProps = {
    initialTab: string;
    style?: any;
    children?: any;
};

export default function Tabs({ initialTab, style, children }: TabsProps) {
    const themeConfig = useThemeConfig();
    const [ tab, setTab ] = useState(initialTab);

    return (
        <View style={style}>
            <View style={{
                flexDirection: "row",

                borderBottomColor: themeConfig.placeholder,
                borderBottomWidth: 2,

                paddingHorizontal: 10
            }}>
                {React.Children.map(children, (child, index) => (
                    <TouchableOpacity key={index} style={{
                        padding: 10,

                        marginBottom: -2,

                        borderBottomColor: (tab === child.props.id)?(themeConfig.color):(themeConfig.placeholder),
                        borderBottomWidth: 2
                    }} onPress={() => setTab(child.props.id)}>
                        <CaptionText style={{
                            textTransform: "uppercase",

                            opacity: (tab === child.props.id)?(1):(0.6)
                        }}>
                            {child.props.title}
                        </CaptionText>
                    </TouchableOpacity>
                ))}
            </View>

            <View>
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
