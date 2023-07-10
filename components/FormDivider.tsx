import React from "react";
import { View, Text, TextStyle } from "react-native";
import { useTheme } from "../utils/themes";

export type FormDividerProps = {
    label?: string;
    labelStyle?: TextStyle;
};

export default function FormDivider({ label, labelStyle }: FormDividerProps) {
    const theme = useTheme();

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginVertical: 10
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
