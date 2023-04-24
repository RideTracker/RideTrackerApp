import { Text } from "react-native";
import { useTheme } from "../../utils/themes";

type ParagraphTextProps = {
    children?: any;
    style?: any;
};

export function ParagraphText({ children, style }: ParagraphTextProps) {
    const theme = useTheme();

    return (
        <Text style={{
            color: theme.color,

            fontSize: 15,
            fontWeight: "400",

            ...style
        }}>
            {children}
        </Text>
    );
};
