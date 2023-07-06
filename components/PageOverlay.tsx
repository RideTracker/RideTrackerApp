import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";
import { ReactNode } from "react";

type PageOverlayProps = {
    children?: ReactNode;
};

export default function PageOverlay({ children}: PageOverlayProps) {
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

            gap: 10
        }}>
            {children}
        </View>
    );
};
