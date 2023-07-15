import React, { ReactNode } from "react";
import { View } from "react-native";

export type ActivityMapDetailProps = {
    children: ReactNode;
}

export function ActivityMapDetail({ children }: ActivityMapDetailProps) {
    return (
        <View style={{
            backgroundColor: "rgba(0, 0, 0, .4)",
            borderRadius: 6,

            padding: 5,

            flexDirection: "row",
            gap: 5,

            alignItems: "center"
        }}>
            {children}
        </View>
    );
};
