import { useUser } from "./user/useUser";
import Client from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import * as Application from "expo-application";

export function useClient() {
    const userData = useUser();

    return new Client(`RideTrackerApp-${Application.nativeApplicationVersion}`, Constants.expoConfig.extra.api, userData.key);
}
