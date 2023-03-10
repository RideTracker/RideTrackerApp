import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useThemeConfig } from "../utils/themes";

type ButtonProps = {
    label?: string;
    icon?: any;
    primary: boolean;

    children?: any;
    style?: any;
    onPress?: any;
};

export default function Button({ primary, label, icon, children, style, onPress }: ButtonProps) {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    return (
        <View style={style}>
            <TouchableOpacity style={{
                width: "100%",

                backgroundColor: (primary)?(themeConfig.brand):(themeConfig.border),
                
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
                   <Text style={{ color: (primary)?(themeConfig.brandText):(themeConfig.color), fontSize: 20, textAlign: "center" }}>{label}</Text>
                )}

                {children}
            </TouchableOpacity>
        </View>
    );
};
