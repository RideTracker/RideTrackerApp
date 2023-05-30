import { ReactNode } from "react";
import { Text, TextStyle } from "react-native";
import { useTheme } from "../../utils/themes";

type HeaderTextProps = {
    children?: ReactNode;
    style?: TextStyle;
};

export function HeaderText({ children, style }: HeaderTextProps) {
    const theme = useTheme();

    return (
        <Text style={{
            color: theme.color,

            fontSize: 20,
            fontWeight: "600",

            ...style
        }}>
            {children}
        </Text>
    );
}
