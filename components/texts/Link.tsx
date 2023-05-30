import { ReactNode } from "react";
import { Text, TextStyle } from "react-native";
import { useTheme } from "../../utils/themes";

type LinkTextProps = {
    children?: ReactNode;
    style?: TextStyle;
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
}
