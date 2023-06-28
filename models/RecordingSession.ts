import { BatteryState, PowerState } from "expo-battery";
import { LocationObject } from "expo-location";

export type RecordingSession = {
    id: string;
    locations: LocationObject[];
    battery: (PowerState & {
        timestamp: number;
    })[];
};
