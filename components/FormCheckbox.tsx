import React, { ReactNode, LegacyRef } from "react";
import { TextInput, View, TextStyle, TextInputProps, TouchableOpacity } from "react-native";
import { useTheme } from "../utils/themes";

type FormCheckboxProps = {
    value: boolean;
    onChange: (value: boolean) => void;
};

export default function FormCheckbox({ value, onChange }: FormCheckboxProps) {
    const theme = useTheme();

    return (
        <TouchableOpacity onPress={() => onChange(!value)}>
            <View style={{
                width: 40,
                height: 40,

                borderWidth: 2,
                borderColor: theme.border,
                borderRadius: 6,

                padding: 5
            }}>
                {(value) && (
                    <View style={{
                        flex: 1,

                        backgroundColor: theme.brand
                    }}/>
                )}
            </View>
        </TouchableOpacity>
    );
};
