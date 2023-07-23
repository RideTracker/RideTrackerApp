import { ReactNode } from "react";
import { GestureResponderEvent, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";

type ButtonProps = {
    primary: boolean;
    type?: "danger" | "stroke" | "overlay-stroke" | "outline";
    label?: string;
    icon?: ReactNode;

    children?: ReactNode;
    style?: ViewStyle;
    onPress?: (event: GestureResponderEvent) => void;
};

export default function Button(props: ButtonProps) {
    const { primary, label, icon, type, children, style, onPress } = props;

    const theme = useTheme();

    return (
        <View style={style}>
            <TouchableOpacity style={{
                width: "100%",

                backgroundColor: (type === "outline")?("rgba(0, 0, 0, .2)"):((type === "danger" || type === "stroke" || type === "overlay-stroke")?("transparent"):((primary)?(theme.brand):(theme.border))),
                
                padding: (type === "outline")?(6):(10),
                borderRadius: 6,

                borderWidth: (type === "outline")?(2):(0),
                borderColor: (type === "outline")?(theme.border):("none"),

                height: 45,

                flexDirection: "row",
                gap: 5,

                justifyContent: "center",
                alignItems: "center"
            }} onPress={onPress}>

                {(icon) && icon}
                {(label) && (
                    <Text style={{ color: (type === "outline")?(theme.background):((type === "danger")?("#FF0000"):((primary)?(theme.brandText):((type === "stroke")?(theme.color):(theme.color)))), fontSize: 20, textAlign: "center" }}>{label}</Text>
                )}

                {children}
            </TouchableOpacity>
        </View>
    );
}
