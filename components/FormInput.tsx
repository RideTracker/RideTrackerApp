import React, { ReactNode, LegacyRef } from "react";
import { TextInput, View, TextStyle, TextInputProps } from "react-native";
import { useTheme } from "../utils/themes";

type FormInputProps = {
    placeholder?: string;
    icon?: ReactNode;
    props?: TextInputProps & {
        enterKeyHint?: string;
    };
    inputRef?: LegacyRef<TextInput>;
    children?: ReactNode;
    style?: TextStyle;
    borderRadius?: number;
};

export default function FormInput({ props, placeholder, icon, inputRef, style, borderRadius }: FormInputProps) {
    const theme = useTheme();

    return (
        <View
            style={{
                width: "100%",

                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: borderRadius ?? 6,

                backgroundColor: theme.background,

                alignItems: "center",

                flexDirection: "row",
                gap: 10,

                paddingLeft: 10
            }}>
            {(icon) && (
                <View style={{
                    marginVertical: 10,
                    width: 30,
                    alignItems: "center",
                    alignSelf: "flex-start"
                }}>
                    {icon}
                </View>
            )}

            <TextInput
                ref={inputRef}
                style={{
                    color: theme.color,
                    fontSize: 20,

                    marginVertical: 5,

                    flex: 1,
                    height: 35,

                    ...style
                }}
                placeholder={placeholder}
                placeholderTextColor={theme.color}

                {...props}
            />
        </View>
    );
}
