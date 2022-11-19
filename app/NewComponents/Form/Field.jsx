import { Component } from "react";
import { View } from "react-native";

export default function Field({ children }) {
    return (
        <View
            style={{
                marginVertical: 6
            }}
            >
            {children}
        </View>
    );
};
