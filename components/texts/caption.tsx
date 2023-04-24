import { Text } from "react-native";
import { useTheme } from "../../utils/themes";

type CaptionTextProps = {
    children?: any;
    style?: any;
    placeholder?: boolean;
};

export function CaptionText({ children, style, placeholder = false }: CaptionTextProps) {
    const theme = useTheme();

    return (
        <Text style={[
            {
                color: theme.color,

                fontSize: 17,
                fontWeight: "500",

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
