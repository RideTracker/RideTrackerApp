import { useEffect } from "react";
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
    useEffect(() => {}, [themeConfig]);

    if(!activity) {
        return (
            <View style={{
                width: "100%",
                height: 200,
                borderRadius: 10,

                backgroundColor: themeConfig.placeholder
            }}/>
        );
    }

    return (
        <View style={{ position: "relative" }}>
            <MapView
                style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 10,
                    backgroundColor: "black"
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
                provider={PROVIDER_GOOGLE}
                customMapStyle={(compact)?(themeConfig.mapStyle.concat(mapStyle.compact as any[])):(themeConfig.mapStyle)}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}/>

            {children}
        </View>
    );
};
