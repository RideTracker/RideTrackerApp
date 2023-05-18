import { Text } from "react-native";
import { useTheme } from "../../utils/themes";

type ParagraphTextProps = {
    children?: any;
    style?: any;
    placeholder?: boolean;
};

export const ParagraphTextFontSize = 15;

export function ParagraphText(props: ParagraphTextProps) {
    const { children, style, placeholder = false } = props;

    const theme = useTheme();

    return (
        <Text style={[
            {
                color: theme.color,

                fontSize: ParagraphTextFontSize,
                fontWeight: "400",

                ...style
            },

            (placeholder) && {
                backgroundColor: theme.placeholder,
                color: "transparent"
            }
        ]}>
            {(placeholder)?(Array(Math.ceil(Math.random() * 10) + 5).fill('A').join('')):(children)}
        </Text>
    );
};
