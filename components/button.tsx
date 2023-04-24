import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../utils/themes";

type ButtonProps = {
    label?: string;
    icon?: any;
    primary: boolean;
    type?: "danger";

    children?: any;
    style?: any;
    onPress?: any;
};

export default function Button({ primary, label, icon, type, children, style, onPress }: ButtonProps) {
    const theme = useTheme();

    return (
        <View style={style}>
            <TouchableOpacity style={{
                width: "100%",

                backgroundColor: (type === "danger")?("transparent"):((primary)?(theme.brand):(theme.border)),
                
                padding: 10,
                borderRadius: 6,

                height: 45,

                flexDirection: "row",
                gap: 5,

                justifyContent: "center",
                alignItems: "center"
            }} onPress={onPress}>

            {(icon) && icon}
                {(label) && (
                   <Text style={{ color: (type === "danger")?("#FF0000"):((primary)?(theme.brandText):(theme.color)), fontSize: 20, textAlign: "center" }}>{label}</Text>
                )}

                {children}
            </TouchableOpacity>
        </View>
    );
};
