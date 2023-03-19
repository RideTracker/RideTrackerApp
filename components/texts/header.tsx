import { Text } from "react-native";
import { useThemeConfig } from "../../utils/themes";

type HeaderTextProps = {
    children?: any;
    style?: any;
};

export function HeaderText({ children, style }: HeaderTextProps) {
    const themeConfig = useThemeConfig();

    return (
        <Text style={{
            color: themeConfig.color,

            fontSize: 20,
            fontWeight: "600",

            ...style
        }}>
            {children}
        </Text>
    );
};
