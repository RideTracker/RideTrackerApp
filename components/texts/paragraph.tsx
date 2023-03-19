import { Text } from "react-native";
import { useThemeConfig } from "../../utils/themes";

type ParagraphTextProps = {
    children?: any;
    style?: any;
};

export function ParagraphText({ children, style }: ParagraphTextProps) {
    const themeConfig = useThemeConfig();

    return (
        <Text style={{
            color: themeConfig.color,

            fontSize: 15,
            fontWeight: "400",

            ...style
        }}>
            {children}
        </Text>
    );
};
