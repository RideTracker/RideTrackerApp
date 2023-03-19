import { Text } from "react-native";
import { useThemeConfig } from "../../utils/themes";

type CaptionTextProps = {
    children?: any;
    style?: any;
};

export function CaptionText({ children, style }: CaptionTextProps) {
    const themeConfig = useThemeConfig();

    return (
        <Text style={{
            color: themeConfig.color,

            fontSize: 17,
            fontWeight: "500",

            ...style
        }}>
            {children}
        </Text>
    );
};
