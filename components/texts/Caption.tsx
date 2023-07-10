import { ReactNode } from "react";
import { Text, TextStyle } from "react-native";
import { useTheme } from "../../utils/themes";

type CaptionTextProps = {
    children?: ReactNode;
    style?: TextStyle;
    placeholder?: boolean;
    placeholderWidth?: number;
    placeholderColor?: string;
};

export function CaptionText({ children, style, placeholder = false, placeholderWidth, placeholderColor }: CaptionTextProps) {
    const theme = useTheme();

    if(!placeholderWidth)
        placeholderWidth = Math.ceil(Math.random() * 10) + 5;

    return (
        <Text style={[
            {
                color: theme.color,

                fontSize: 17,
                fontWeight: "500",

                ...style
            },

            (placeholder) && {
                backgroundColor: placeholderColor ?? theme.placeholder,
                color: "transparent"
            }
        ]}>
            {(placeholder)?(Array(placeholderWidth).fill("A").join("")):(children)}
        </Text>
    );
}
