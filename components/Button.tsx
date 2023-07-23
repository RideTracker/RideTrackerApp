import { ReactNode } from "react";
import { GestureResponderEvent, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";

type ButtonProps = {
    primary: boolean;
    type?: "danger" | "stroke" | "overlay-stroke" | "outline";
    label?: string;
    icon?: ReactNode;

    borderRadius?: number;

    children?: ReactNode;
    style?: ViewStyle;
    onPress?: (event: GestureResponderEvent) => void;
};


export default function Button(props: ButtonProps) {
    const { borderRadius = 6, primary, label, icon, type, children, style, onPress } = props;

    const theme = useTheme();

    const buttonStyles: {
        [key: string]: ViewStyle & { color: string };
    } = {
        "outline": {
            backgroundColor: "rgba(0, 0, 0, .2)",
            
            padding: 6,
            
            borderWidth: 2,
            borderColor: theme.color,

            color: theme.background
        },

        "danger": {
            backgroundColor: "transparent",
            color: "#FF0000"
        },

        "stroke": {
            color: theme.color
        }
    };

    return (
        <View style={style}>
            <TouchableOpacity style={{
                width: "100%",
                borderRadius,

                height: 45,

                flexDirection: "row",
                gap: 5,

                justifyContent: "center",
                alignItems: "center",
                
                ...buttonStyles[type],

                backgroundColor: buttonStyles[type]?.backgroundColor ?? ((primary)?(theme.brand):(theme.border)),
                
                padding: buttonStyles[type]?.padding ?? 10
            }} onPress={onPress}>
                {(icon) && icon}

                {(label) && (
                    <Text style={{ color: buttonStyles[type]?.color ?? (primary)?(theme.brandText):(theme.color), fontSize: 20, textAlign: "center" }}>{label}</Text>
                )}

                {children}
            </TouchableOpacity>
        </View>
    );
}
