import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../utils/themes";

type LinkTextProps = {
    children?: any;
    style?: any;
};

export function LinkText({ children, style }: LinkTextProps) {
    const theme = useTheme();

    return (
        <Text style={{
            color: theme.brand,

            ...style
        }}>
            {children}
        </Text>
    );
};
