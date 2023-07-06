import React, { useState, useEffect } from "react";
import { LayoutRectangle, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityPersonalBest } from "./ActivityPersonalBest";
import { ParagraphText, ParagraphTextFontSize } from "./texts/Paragraph";
import { getFormattedActivitySummary } from "../controllers/getFormattedActivitySummary";
import { CaptionText } from "./texts/Caption";

type ActivitySummaryProps = {
    type: string;
    value: number;
    color?: string;
    contrast?: "white" | "black";
};

export function BikeActivitySummary({ type, value, color, contrast }: ActivitySummaryProps) {
    const [ stat ] = useState(getFormattedActivitySummary(type, value));

    if(!stat)
        return null;

    if(!color)
        color = "white";

    return (
        <View>
            <CaptionText style={{ color, textAlign: "center", fontSize: 16 }}>{stat.value}</CaptionText>
            <ParagraphText style={{ color, textAlign: "center", fontSize: 14 }}>{stat.name}</ParagraphText>
        </View>
    );
};
