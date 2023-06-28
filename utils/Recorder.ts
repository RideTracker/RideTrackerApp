import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { Platform } from "react-native"; 
import uuid from "react-native-uuid";
import * as Battery from 'expo-battery';
import { RecordingSession } from "../models/RecordingSession";

const RECORDER_TASK_NAME = "RECORDER";

TaskManager.defineTask(RECORDER_TASK_NAME, ({ data, error }) => {
    if(error)
        return console.error("Geolocation error: " + JSON.stringify(error));
    
    if(data) {
        const { locations } = data as {
            locations: Location.LocationObject[];
        };

        if(Recorder.instance !== null)
            Recorder.handleLocations(Recorder.instance, locations);
    }
});

export default class Recorder {
    static instance: Recorder = null;

    active: boolean = false;
    timer: NodeJS.Timer = null;

    sessions: RecordingSession[] = [];

    onLocation?: (location: Location.LocationObject) => void;

    constructor() {
    };

    async start() {
        try {
            await Location.startLocationUpdatesAsync(RECORDER_TASK_NAME, {
                accuracy: Location.Accuracy.BestForNavigation,
                foregroundService: {
                    notificationTitle: "Ride Tracker",
                    notificationBody: "Location is used when Ride Tracker is in background",
                },
                activityType: Location.ActivityType.Fitness,
                showsBackgroundLocationIndicator: true
            });

            this.timer = setInterval(() => Recorder.handleTimer(Recorder.instance), 60 * 1000);

            this.sessions.push({
                id: uuid.v4() as string,
                locations: [],
                battery: []
            });

            this.active = true;

            Recorder.instance = this;

            Recorder.handleTimer(Recorder.instance);
        }
        catch(error) {
            console.error(error);
        }
    };

    stop() {
        Location.stopLocationUpdatesAsync(RECORDER_TASK_NAME);

        if(this.timer) {
            clearInterval(this.timer);
            
            this.timer = null;
        }

        this.active = false;
    };

    getFirstSession() {
        return this.sessions[0];
    };

    getLastSession() {
        if(!this.sessions.length)
            return null;

        return this.sessions[this.sessions.length - 1];
    };

    getLastSessionLastLocation() {
        const lastSession = this.getLastSession();

        if(!lastSession || !lastSession.locations.length)
            return null;

        return lastSession.locations[lastSession.locations.length - 1];
    };

    getLastSessionLastBattery() {
        const lastSession = this.getLastSession();

        if(!lastSession || !lastSession.battery.length)
            return null;

        return lastSession.battery[lastSession.battery.length - 1];
    };

    getElapsedTime() {
        let time = 0;

        this.sessions.forEach((session, index) => {
            if(this.active && index === this.sessions.length - 1 && session.locations.length) {
                time += Date.now() - session.locations[0].timestamp;
            }
            else if(session.locations.length >= 2) {
                time += session.locations[session.locations.length - 1].timestamp - session.locations[0].timestamp;
            }
        });

        return Math.floor(time / 1000);
    };

    static handleLocations(instance: Recorder, locations: Location.LocationObject[]) {
        locations.forEach((location) => {
            console.log("Received geolocation: " + JSON.stringify(location));

            if(instance.active)
                instance.sessions[instance.sessions.length - 1].locations.push(location);
            
            if(instance.onLocation)
                instance.onLocation(location);
        });
    };

    static handleTimer(instance: Recorder) {
        Battery.getPowerStateAsync().then((batteryState) => {
            if(batteryState.batteryLevel === -1)
                return;

            const batteryLevel = Math.round(batteryState.batteryLevel * 100);

            const newBatteryState: Battery.PowerState = {
                ...batteryState,
                batteryLevel
            };

            const previousBatteryState = instance.getLastSessionLastBattery();

            if(!previousBatteryState ||
                previousBatteryState.batteryLevel !== newBatteryState.batteryLevel ||
                previousBatteryState.batteryState !== newBatteryState.batteryState ||
                previousBatteryState.lowPowerMode !== newBatteryState.lowPowerMode) {
                console.log("Received battery state: " + JSON.stringify(newBatteryState));
    
                if(instance.active) {
                    instance.sessions[instance.sessions.length - 1].battery.push({
                        ...newBatteryState,
                        timestamp: Date.now()
                    });
                }
            }
        });
    };
};
