import { Text } from "react-native";
import { useTheme } from "../../utils/themes";

type HeaderTextProps = {
    children?: any;
    style?: any;
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
