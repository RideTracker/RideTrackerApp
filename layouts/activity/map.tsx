import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityResponse } from "../../models/activity";
import { useThemeConfig, useMapStyle } from "../../utils/themes";

type ActivityMapProps = {
    activity: ActivityResponse | null;
    children?: any;
    compact: boolean;
};

export default function ActivityMap({ activity, children, compact }: ActivityMapProps) {
    const mapStyle = useMapStyle();
    const themeConfig = useThemeConfig();

    if(!activity) {
        return (
            <View style={{
                width: "100%",
                height: 200,
                borderRadius: 10,

                backgroundColor: "#EEE"
            }}/>
        );
    }

    return (
        <View style={{ position: "relative" }}>
            <MapView
                style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 10
                }}
                initialCamera={{
                    center: {
                        latitude: 58.3797265530217,
                        longitude: 12.324476378487843
                    },

                    heading: 0,
                    pitch: 0,

                    zoom: 10
                }}
                customMapStyle={(compact)?(themeConfig.mapStyle.concat(mapStyle.compact as any[])):(themeConfig.mapStyle)}
                provider={PROVIDER_GOOGLE}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}/>

            {children}
        </View>
    );
};
