import { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useThemeConfig } from "../utils/themes";

type FormInputProps = {
    placeholder?: string;
    icon?: any;

    children?: any;
    style?: any;
};

export default function FormInput({ placeholder, icon, children, style }: FormInputProps) {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    return (
        <View style={style}>
            <View
                style={{
                    width: "100%",

                    borderWidth: 1,
                    borderColor: themeConfig.border,
                    borderRadius: 6,

                    alignItems: "center",

                    flexDirection: "row",
                    gap: 10
                }}>
                {(icon) && (
                    <View style={{
                        marginLeft: 10,
                        width: 30,
                        alignItems: "center"
                    }}>
                        {icon}
                    </View>
                )}

                <TextInput
                    style={{
                        color: themeConfig.color,
                        fontSize: 20,

                        paddingVertical: 5,

                        flex: 1,
                        height: 45
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={themeConfig.color}
                    />
            </View>
        </View>
    );
};
