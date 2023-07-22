import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { GraphDatasetPoints } from "./Graph";
import { useTheme } from "../utils/themes";
import { ParagraphText } from "./texts/Paragraph";
import * as chroma from "chroma.ts";

export type GraphPointProps = {
    point: GraphDatasetPoints["points"][0];
    selected?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
};

export default function GraphPoint({ point, selected, onPress }: GraphPointProps) {
    const theme = useTheme();

    const size = (selected)?(18):(10);
    const border = (selected)?(10):(4);

    console.log(`rgba(${chroma.css(theme.brand).rgb().join(', ')}, .1)`);

    return (
        <TouchableOpacity disabled={selected} style={{
            position: "absolute",

            left: point.location.x - ((size + border) / 2),
            top: point.location.y - ((size + border) / 2),

            width: size + border,
            height: size + border,

            borderRadius: size + border,

            backgroundColor: (selected)?(`rgba(${chroma.css(theme.brand).rgb().join(', ')}, .5)`):(theme.brand),

            justifyContent: "center",
            alignItems: "center"
        }} onPress={onPress}>
            <View style={{
                backgroundColor: (selected)?(theme.brand):(theme.background),

                width: size,
                height: size,
    
                borderRadius: size
            }}/>
        </TouchableOpacity>
    )
};
