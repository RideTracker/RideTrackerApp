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

            gap: 10,
            padding: 10
        }}>
            <Entypo name="location" size={72} color={"white"}/>

            <CaptionText style={{ color: "white" }}>Location permissions are needed!</CaptionText>
            <ParagraphText style={{ color: "white" }}>RideTracker uses your location to record your position during activities and route planning.{"\n"}{"\n"}During activity recordings, your location is also recorded in the background.</ParagraphText>

            <View style={{
                position: "absolute",

                bottom: 0,

                width: "100%",

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

                <Button primary={false} label="Open app settings" type="stroke" onPress={() => {
                    Linking.openSettings();
                }}/>
            </View>
        </View>
    );
};
