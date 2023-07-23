import { View, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";
import { ReactNode } from "react";

type PageOverlayProps = {
    children?: ReactNode;
    pointerEvents?: "box-none" | "none" | "box-only" | "auto";
    style?: ViewStyle;
};

export default function PageOverlay({ children, style, pointerEvents = "auto" }: PageOverlayProps) {
    const theme = useTheme();

    return (
        <View style={{
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            backgroundColor: `rgba(0, 0, 0, .3)`,

            justifyContent: "center",
            alignItems: "center",

            gap: 10,

            ...style
        }} pointerEvents={pointerEvents}>
            {children}
        </View>
    );
};
