import { useDispatch } from "react-redux";
import Button from "../../../../components/Button";
import ModalPage from "../../../../components/ModalPage";
import { setUserData } from "../../../../utils/stores/userData";
import { setClient } from "../../../../utils/stores/client";
import { createRideTrackerClient } from "@ridetracker/ridetrackerclient";
import Constants  from "expo-constants";
import { useTheme } from "../../../../utils/themes";
import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileSettings() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <ModalPage>
            <View style={{ padding: 10, gap: 10 }}>
                <Button primary={false} label="Manage wearable devices" onPress={() => router.push("/profile/devices")}/>

                <Button primary={false} type="danger" label="Sign out" onPress={() => {
                    dispatch(setUserData({ email: null, token: null }));
                    dispatch(setClient(createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, null)));
                }}/>
            </View>
        </ModalPage>
    );
};
