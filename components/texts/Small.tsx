import { ReactNode } from "react";
import { Text, TextStyle } from "react-native";
import { useTheme } from "../../utils/themes";

type SmallTextProps = {
    children?: ReactNode;
    style?: TextStyle;
    placeholder?: boolean;
};

export const SmallTextFontSize = 11;

export function SmallText(props: SmallTextProps) {
    const { children, style, placeholder = false } = props;

    const theme = useTheme();

    return (
        <Text style={[
            {
                color: theme.color,

                fontSize: SmallTextFontSize,
                fontWeight: "400",

                ...style
            },

            (placeholder) && {
                backgroundColor: theme.placeholder,
                color: "transparent"
            }
        ]}>
            {(placeholder)?(Array(Math.ceil(Math.random() * 10) + 5).fill("A").join("")):(children)}
        </Text>
    );
}
