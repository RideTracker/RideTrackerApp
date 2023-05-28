import { View } from "react-native";
import WebView from "react-native-webview";
import { useTheme } from "../utils/themes";
import Constants from "expo-constants";

type ActivityRouteProps = {
    activity: any;
};

export default function ActivityRoute(props: ActivityRouteProps) {
    const { activity } = props;

    const theme = useTheme();

    //console.log(`${Constants.expoConfig.extra.route}/activities/${activity.id}`);

    return (
        <View style={{ height: 100 }}>
            {(activity)?(
                <WebView source={{
                    headers: {
                        "RideTracker-Theme-Background": theme.background
                    },

                    uri: `${Constants.expoConfig.extra.route}/activities/${activity.id}`
                }}/>
            ):(
                <View style={{ backgroundColor: theme.placeholder }}/>
            )}
        </View>
    );
};