import { useUser } from "./user/useUser";
import Client from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";

export function useClient() {
    const userData = useUser();
    
    return new Client(Constants.expoConfig.extra.api, userData.key);
}
