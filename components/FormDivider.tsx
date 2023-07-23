import React from "react";
import { View, Text, TextStyle, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";

export type FormDividerProps = {
    label?: string;
    labelStyle?: TextStyle;
    style?: ViewStyle;
};

export default function FormDivider({ label, labelStyle, style }: FormDividerProps) {
    const theme = useTheme();

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginVertical: 10,
            ...style
        }}>
            <View style={{
                flex: 1,
                height: 2,
                backgroundColor: theme.border
            }}/>

            {(label) && (
                <React.Fragment>
                    <Text style={{
                        color: theme.color,
                        textTransform: "uppercase",
                        ...labelStyle
                    }}>
                        {label}
                    </Text>

                    <View style={{
                        flex: 1,
                        height: 2,
                        backgroundColor: theme.border
                    }}/>
                </React.Fragment>
            )}
        </View>
    );
};
