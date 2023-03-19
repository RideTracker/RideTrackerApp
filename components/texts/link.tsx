import { Text, TouchableOpacity } from "react-native";
import { useThemeConfig } from "../../utils/themes";

type LinkTextProps = {
    children?: any;
    style?: any;
};

export function LinkText({ children, style }: LinkTextProps) {
    const themeConfig = useThemeConfig();

    return (
        <Text style={{
            color: themeConfig.brand,

            ...style
        }}>
            {children}
        </Text>
    );
};
