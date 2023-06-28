import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";

export default function OfflinePageOverlay() {
    const theme = useTheme();

    return (
        <View style={{
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            backgroundColor: `rgba(${(theme.contrast === "black")?("255, 255, 255"):("0, 0, 0")}, .3)`,

            justifyContent: "center",
            alignItems: "center",

            gap: 10
        }}>
            <MaterialIcons name="wifi-off" size={72} color={theme.contrast}/>

            <CaptionText style={{ color: theme.contrast }}>You are currently offline!</CaptionText>
            <ParagraphText style={{ color: theme.contrast }}>Internet connection is required for this page.</ParagraphText>
        </View>
    );
};
