import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useClient } from "./useClient";
import Client from "@ridetracker/ridetrackerclient";

export default function useInternetConnection() {
    const [ internetConnection, setInternetConnection ] = useState<"UNKNOWN" | "ONLINE" | "OFFLINE">("UNKNOWN");

    useEffect(() => {
        const listener = Client.addEventListener("NETWORK_STATUS", () => {
            console.log("Network state changed: " + Client.networkStatus);
        });

        return () => {
            Client.removeEventListener(listener);
        };
    }, []);

    return internetConnection;
};
