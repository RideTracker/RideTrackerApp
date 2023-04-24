import { Text } from "react-native";
import { useTheme } from "../../utils/themes";

type CaptionTextProps = {
    children?: any;
    style?: any;
};

export function CaptionText({ children, style }: CaptionTextProps) {
    const theme = useTheme();

    return (
        <Text style={{
            color: theme.color,

            fontSize: 17,
            fontWeight: "500",

            ...style
        }}>
            {children}
        </Text>
    );
};
