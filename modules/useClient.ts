import Client, { createClient } from "@ridetracker/ridetrackerclient";
import { useSelector } from "react-redux";
import Constants from "expo-constants";

export function useClient() {
    const client: Client = useSelector<{ client: Client }, Client>((state) => state.client) ?? createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api);
    
    return client;
}
