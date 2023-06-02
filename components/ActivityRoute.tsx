import { View } from "react-native";
import WebView from "react-native-webview";
import { useTheme } from "../utils/themes";
import Constants from "expo-constants";

type ActivityRouteProps = {
    activity: {
        id: string;
    };
};

export default function ActivityRoute(props: ActivityRouteProps) {
    const { activity } = props;

    const theme = useTheme();

    //console.log(`${Constants.expoConfig.extra.route}/activities/${activity.id}`);

    return (
        /*<View style={{ height: 100 }}>
            {(activity)?(
                <WebView style={{ backgroundColor: "transparent" }} source={{
                    headers: {
                        "RideTracker-Theme-Background": theme.background
                    },

                    uri: `${Constants.expoConfig.extra.route}/activities/${activity.id}/route`
                }}/>
            ):(
                <View style={{ backgroundColor: theme.placeholder }}/>
            )}
        </View>*/
        null
    );
}
