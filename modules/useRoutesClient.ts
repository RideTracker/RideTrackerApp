import Constants from "expo-constants";
import { useClient } from "./useClient";
import { createAuthClient } from "@ridetracker/routeclient";

export function useRoutesClient() {
    const client = useClient();

    return createAuthClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.routesApi, client.token);
};
