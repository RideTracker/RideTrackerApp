import { useEffect, useRef, useState } from "react";
import { Button, ScrollView, View } from "react-native";
import { Stack, Tabs, useRouter } from "expo-router";
import { useThemeConfig } from "../../../../utils/themes";
import MapView, { Circle, Marker, Overlay, PROVIDER_GOOGLE } from "react-native-maps";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const RECORD_TASK_NAME = "RECORD_GEOLOCATION";

export default function Record() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();

    const [ location, setLocation ] = useState(null);

    const mapRef = useRef();

    useEffect(() => {
        async function startLocationUpdates() {
            {
                let { status } = await Location.requestForegroundPermissionsAsync();
    
                if(status !== "granted") {
                    router.push("/record/error");
    
                    return;
                }
            }

            {
                let { status } = await Location.requestBackgroundPermissionsAsync();
    
                if(status !== "granted") {
                    router.push("/record/error");
    
                    return;
                }
            }

            TaskManager.defineTask(RECORD_TASK_NAME, ({ data, error }: { data: any, error: any }) => {
                const locations = data.locations;

                if(error || !locations.length) {
                    console.error("Geolocation error occurred, ", error);
            
                    return;
                }
            
                console.log("Geolocation received new locations", locations);

                setLocation(locations[locations.length - 1]);
            });

            if(TaskManager.isTaskDefined(RECORD_TASK_NAME))
                await Location.startLocationUpdatesAsync(RECORD_TASK_NAME);
        };

        startLocationUpdates();

        return () => {
            if(TaskManager.isTaskDefined(RECORD_TASK_NAME))
                TaskManager.unregisterTaskAsync(RECORD_TASK_NAME);

            Location.stopLocationUpdatesAsync(RECORD_TASK_NAME);
        };
    }, []);

    useEffect(() => {
        if(location && mapRef.current) {
            const map: MapView = mapRef.current;

            map.setCamera({
                center: location.coords,
                zoom: 16
            });
        }
    }, [ location ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <Tabs.Screen options={{
                headerTransparent: true,
                headerRight: () => (
                    <Button
                      onPress={() => router.back()}
                      title="Close"
                      color={themeConfig.color}
                    />
                  )
            }}/>

            <MapView
                ref={mapRef}
                
                style={{
                    flex: 1
                }}
                
                customMapStyle={themeConfig.mapStyle}
                
                provider={PROVIDER_GOOGLE}

                showsCompass={false}
                showsUserLocation={true}
                showsMyLocationButton={false}
                >
            </MapView>
        </View>
    );
};
