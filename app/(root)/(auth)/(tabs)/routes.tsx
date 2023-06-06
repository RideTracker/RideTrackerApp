import { useState, useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { HeaderText } from "../../../../components/texts/Header";
import * as Location from "expo-location";
import Tabs, { TabsPage } from "../../../../components/Tabs";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import FormInput from "../../../../components/FormInput";

export default function Routes() {
    const theme = useTheme();
    const router = useRouter();

    const mapRef = useRef<MapView>();

    const [ initialLocation, setInitialLocation ] = useState(null);

    useEffect(() => {
        Location.getForegroundPermissionsAsync().then(async (permissions) => {
            if(!permissions.granted) {
                const result = await Location.requestForegroundPermissionsAsync();

                if(!result.granted) {
                    router.back();

                    return;
                }
            }

            Location.getCurrentPositionAsync().then((location) => {
                setInitialLocation(location);
    
                mapRef.current.setCamera({
                    zoom: 12,
                    
                    center: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                });
            });
        })
    }, []);
    
    return (
        <View style={{ flex: 1, position: "relative", backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Routes",
                headerTransparent: true
            }} />

            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                style={{
                    position: "absolute",

                    width: "100%",
                    height: "100%",

                    left: 0,
                    bottom: 0
                }}
                onPanDrag={() => {}}
                customMapStyle={theme.mapStyle}
                ></MapView>

            <View style={{
                flex: 1,

                marginTop: 90,

                padding: 10
            }}>
                <FormInput borderRadius={20} placeholder="Search for a place..." icon={
                    <FontAwesome name="search" size={24} color={theme.color} />
                }></FormInput>
            </View>

            {(!initialLocation) && (
                <View style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%",

                    backgroundColor: "rgba(0, 0, 0, .6)",

                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <HeaderText>Getting your location...</HeaderText>
                </View>
            )}

            {/*<View style={{
                backgroundColor: theme.background,

                width: "100%",
                height: 50,

                position: "absolute",

                bottom: 0,
                left: 0,

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            }}>
                <Tabs initialTab="routes">
                    <TabsPage id="routes" title="Your routes">

                    </TabsPage>
                    
                    <TabsPage id="routes2" title=" ">

                    </TabsPage>
                </Tabs>
            </View>*/}
        </View>
    );
}
