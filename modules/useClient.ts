import Client, { createRideTrackerClient } from "@ridetracker/ridetrackerclient";
import { useSelector } from "react-redux";
import Constants from "expo-constants";

export function useClient() {
    const client: Client = useSelector<{ client: Client }, Client>((state) => state.client) ?? createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, null);
    
    return client;
}
