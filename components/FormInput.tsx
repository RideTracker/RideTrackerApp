import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../utils/themes";

type FormInputProps = {
    placeholder?: string;
    icon?: any;
    props?: any;

    inputRef?: any;
    children?: any;
    style?: any;
};

export default function FormInput({ props, placeholder, icon, inputRef, style }: FormInputProps) {
    const theme = useTheme();

    const [ value, setValue ] = useState("");

    function getValue() {
        return value;
    };

    return (
        <View
            style={{
                width: "100%",

                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 6,

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
                onChangeText={(text) => setValue(text)}

                {...props}
                />
        </View>
    );
};
