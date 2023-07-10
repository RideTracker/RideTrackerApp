import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";
import Button from "./Button";
import FormDivider from "./FormDivider";
import { useRouter } from "expo-router";

export default function SubscriptionPageOverlay() {
    const router = useRouter();

    return (
        <View style={{
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            backgroundColor: `rgba(0, 0, 0, .75)`,

            justifyContent: "center",
            alignItems: "center",

            gap: 10
        }}>
            <Ionicons name="logo-google-playstore" size={72} color={"white"}/>

            <CaptionText style={{ color: "white" }}>Subscription is needed!</CaptionText>
            <ParagraphText style={{ color: "white" }}>A subscription is needed for this page.</ParagraphText>

            <View style={{
                position: "absolute",

                bottom: 0,

                width: "100%",

                padding: 10
            }}>
                <Button primary={true} label="Show subscriptions" onPress={() => {
                    router.push("/subscriptions/list");
                }}/>
            </View>
        </View>
    );
};
