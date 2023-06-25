import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { Platform } from "react-native"; 
import uuid from "react-native-uuid";

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

    sessions: {
        id: string;
        locations: Location.LocationObject[];
    }[] = [];

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

            this.sessions.push({
                id: uuid.v4() as string,
                locations: []
            });

            this.active = true;

            Recorder.instance = this;
        }
        catch(error) {
            if(Platform.OS !== "ios")
                console.error(error);
        }
    };

    stop() {
        Location.stopLocationUpdatesAsync(RECORDER_TASK_NAME);

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

        return Math.round(time / 1000);
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
};
