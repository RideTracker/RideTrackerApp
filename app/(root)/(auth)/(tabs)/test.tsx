import { useState, useEffect } from "react";
import { Platform, ScrollView, View, TouchableWithoutFeedback } from "react-native";
import { useDispatch } from "react-redux";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import Button from "../../../../components/Button";
import { setUserData } from "../../../../utils/stores/userData";
import { setClient } from "../../../../utils/stores/client";
import { SelectList } from "../../../../components/SelectList";
import { useUser } from "../../../../modules/user/useUser";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { setSearchPredictions } from "../../../../utils/stores/searchPredictions";

export default function Test() {
    const theme = useTheme();
    const userData = useUser();
   
    const [ focus, setFocus ] = useState<boolean>(false);
    const [ drawing, setDrawing ] = useState<boolean>(false);
    const [ drawingTimestamp, setDrawingTimestamp ] = useState<number>(0);

    const [ coordinates, setCoordinates ] = useState<{
        latitude: number;
        longitude: number;
    }[]>([]);

    useFocusEffect(() => {
        setFocus(true);

        return () => setFocus(false);
    });
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Test" }} />

            {(focus) && (
                <TouchableWithoutFeedback
                    style={{
                        flex: 1
                    }}
                    onPressIn={() => setDrawing(true)}
                    onPressOut={() => setDrawing(false)}>
                    <MapView
                        style={{
                            flex: 1
                        }}
                        provider={userData.mapProvider}
                        scrollEnabled={false}
                        onPanDrag={(event) => {
                            if(!drawing)
                                return;

                            const timestamp = performance.now();

                            if(timestamp - drawingTimestamp < 30)
                                return;

                            setDrawingTimestamp(timestamp);
                            setCoordinates(coordinates.concat(event.nativeEvent.coordinate));
                        }}>
                        <Polyline coordinates={coordinates}/>
                    </MapView>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
}
