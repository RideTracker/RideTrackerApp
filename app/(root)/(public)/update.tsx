import { Image, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { useTheme } from "../../../utils/themes";
import { CaptionText } from "../../../components/texts/Caption";
import { ParagraphText } from "../../../components/texts/Paragraph";
import Button from "../../../components/Button";
import { LinkText } from "../../../components/texts/Link";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../utils/stores/userData";

const logo = require("../../../assets/logos/logo.png");

export default function Update() {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <View style={{
            flex: 1,

            backgroundColor: theme.background,

            justifyContent: "center",
            alignItems: "center",

            gap: 10,
            padding: 10
        }}>

            <View style={{
                width: "100%",

                flex: 1,
                justifyContent: "center"
            }}>
                <Image source={logo} style={{ height: 100, width: "100%", resizeMode: "contain" }}/>

                <CaptionText>A new version of RideTracker is available!</CaptionText>

                <ParagraphText>You can find a new version of RideTracker available on the Play Store.</ParagraphText>
            </View>


            <View style={{
                paddingVertical: 10,
                gap: 10,
                width: "100%"
            }}>
                <Button primary={true} label="Show update" onPress={() => {
                    Linking.openURL("https://play.google.com/store/apps/details?id=com.norasoderlund.ridetrackerapp");
                }}/>

                <Button primary={false} label="Remind me later" type="stroke" onPress={() => {
                    const date = new Date();

                    date.setHours(date.getHours() + 2);

                    dispatch(setUserData({
                        updateTimeout: date.getTime()
                    }));

                    router.back();
                }}/>
            </View>
        </View>
    );
};
