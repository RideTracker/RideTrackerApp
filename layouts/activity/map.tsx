import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityResponse } from "../../models/activity";
import mapStyles from "../../components/mapStyles.json";

type ActivityMapProps = {
    activity: ActivityResponse | null;
    children?: any;
};

export default function ActivityMap({ activity, children }: ActivityMapProps) {
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
                customMapStyle={mapStyles.compact}
                provider={PROVIDER_GOOGLE}
                mapType={"terrain"}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}/>

            {children}
        </View>
    );
};
