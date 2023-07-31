import React, { ReactNode } from "react";
import { View } from "react-native";
import { ParagraphText } from "./texts/Paragraph";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../utils/themes";

const features: {
    key: string;
    icon: (theme: any) => ReactNode;
    description: string;
}[] = [
    {
        key: "routes",
        description: "Create directions-ready routes with waypoints, shapes, or drawings!",
        icon: (theme) => (<FontAwesome5 name="route" color={theme.brand} size={40}/>)
    },

    {
        key: "stats",
        description: "Get meaningful insights of your activities that you can export in various formats!",
        icon: (theme) => (<FontAwesome5 name="chart-area" color={theme.brand} size={40}/>)
    },

    {
        key: "bike_stats",
        description: "Get meaningful insights of your efforts on different bikes!",
        icon: (theme) => (<FontAwesome5 name="bicycle" color={theme.brand} size={40}/>)
    }
];

export default function SubscriptionFeatures() {
    const theme = useTheme();
    
    return (
        <React.Fragment>
            {features.map((feature) => (
                <View key={feature.key} style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center"
                }}>
                    <View style={{
                        width: 64,
                        height: 64,

                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {feature.icon(theme)}
                    </View>

                    <ParagraphText style={{ paddingRight: 64 + 10 }}>{feature.description}</ParagraphText>
                </View>
            ))}
        </React.Fragment>
    );
};
