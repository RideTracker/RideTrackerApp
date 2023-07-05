import Constants from "expo-constants";
import Client from "@ridetracker/avatarclient";
import { useUser } from "./user/useUser";

export function useAvatarClient() {
    const userData = useUser();

    return new Client(Constants.expoConfig.extra.avatarApi, userData.key);
};
