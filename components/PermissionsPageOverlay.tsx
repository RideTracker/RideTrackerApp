import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";
import Button from "./Button";
import FormDivider from "./FormDivider";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as Linking from "expo-linking";

export type PermissionsPageOverlayProps = {
    required: ("foreground" | "background")[];
    onGranted: (permissions: Location.LocationPermissionResponse) => void;
};

export default function PermissionsPageOverlay({ required, onGranted }: PermissionsPageOverlayProps) {
    const theme = useTheme();
    const router = useRouter();

    return (
        <View style={{
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            backgroundColor: theme.background,

            justifyContent: "center",

            gap: 10,
            padding: 10
        }}>
            <Entypo name="location" size={72} color={"grey"} style={{
                alignSelf: "center"
            }}/>

            <CaptionText>RideTracker collects location data to enable route planning and activity recording even when the app is closed or not in use.</CaptionText>

            <ParagraphText>Your location is tracked in the background only when you're recording an activity, this is so that you can safely lock your phone screen during your activities.</ParagraphText>

            <ParagraphText>If you deny location permissions, you will not be able to record activities or use the route planner.</ParagraphText>

            <View style={{
                paddingVertical: 10,
                gap: 10
            }}>
                <Button primary={true} label="Grant permissions" onPress={() => {
                    Location.requestForegroundPermissionsAsync().then((permissions) => {
                        if(permissions.granted) {
                            if(required.includes("background")) {
                                Location.requestBackgroundPermissionsAsync().then((permissions) => {
                                    if(permissions.granted)
                                        onGranted(permissions);
                                })
                            }
                            else
                                onGranted(permissions);
                        }
                    })
                }}/>

                <Button primary={false} label="Deny permissions" type="danger" onPress={() => {
                    router.back();
                }}/>
            </View>
        </View>
    );
};
