import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import uuid from "react-native-uuid";
import * as Battery from 'expo-battery';
import * as FileSystem from "expo-file-system";
import { Recording, RecordingSession, RecordingSessionBatteryState, RecordingSessionCoordinate } from "@ridetracker/ridetrackertypes";

export const RECORDINGS_PATH = FileSystem.documentDirectory + "recordings/";
export const RECORDER_TASK_NAME = "RECORDER";

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

    recording: Recording;

    onLocation?: (location: Location.LocationObject) => void;

    constructor() {
        this.recording = {
            id: uuid.v4() as string,
            version: 2,
            sessions: []
        };
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

            this.recording.sessions.push({
                id: uuid.v4() as string,
                coordinates: [],
                speeds: [],
                altitudes: [],
                batteryStates: [],
                heartRates: [],
                calories: []
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

    async saveCurrentSession() {
        let info = await FileSystem.getInfoAsync(RECORDINGS_PATH);

        if(!info.exists)
            await FileSystem.makeDirectoryAsync(RECORDINGS_PATH);

        const recordingPath = RECORDINGS_PATH + this.recording.id + ".json";

        await FileSystem.writeAsStringAsync(recordingPath, JSON.stringify(this.recording));

        console.log("Saved current session to " + recordingPath);
    }

    getFirstItem<T>(key: keyof RecordingSession): T | null {
        for(let index = 0; index < this.recording.sessions.length; index++) {
            const session = this.recording.sessions[index];
    
            if(!session[key].length)
                continue;
    
            return session[key][0] as T;
        }
    
        return null;
    };

    getLastItem<T>(key: keyof RecordingSession): T | null {
        for(let index = this.recording.sessions.length - 1; index !== -1; index--) {
            const session = this.recording.sessions[index];
            
            if(!session[key].length)
                continue;
    
            return session[key][session[key].length - 1] as T;
        }
    
        return null;
    };

    getElapsedTime() {
        let time = 0;

        this.recording.sessions.forEach((session, index) => {
            if(this.active && index === this.recording.sessions.length - 1 && session.coordinates.length) {
                time += Date.now() - session.coordinates[0].timestamp;
            }
            else if(session.coordinates.length >= 2) {
                time += session.coordinates[session.coordinates.length - 1].timestamp - session.coordinates[0].timestamp;
            }
        });

        return Math.floor(time / 1000);
    };

    static handleLocations(instance: Recorder, locations: Location.LocationObject[]) {
        locations.forEach((location) => {
            console.log("Received geolocation: " + JSON.stringify(location));

            if(instance.active) {
                if(!instance.recording.sessions.length) {
                    console.warn("Recording sessions are empty but instance is active! Repairing automatically, but this is dangerous!");

                    instance.recording.sessions.push({
                        id: uuid.v4() as string,
                        coordinates: [],
                        speeds: [],
                        altitudes: [],
                        batteryStates: [],
                        heartRates: [],
                        calories: []
                    });
                }

                const session = instance.recording.sessions[instance.recording.sessions.length - 1];

                session.coordinates.push({
                    coordinate: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    },
                    accuracy: location.coords.accuracy,
                    timestamp: location.timestamp
                });
                
                session.altitudes.push({
                    altitude: location.coords.altitude,
                    accuracy: location.coords.altitudeAccuracy,
                    timestamp: location.timestamp
                });

                session.speeds.push({
                    speed: location.coords.speed,
                    accuracy: location.coords.accuracy,
                    timestamp: location.timestamp
                });
            }
            
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

            const previousBatteryState = instance.getLastItem<RecordingSessionBatteryState>("batteryStates");

            if(!instance.recording.sessions.length)
                return;

            const session = instance.recording.sessions[instance.recording.sessions.length - 1];

            let chargingState: RecordingSessionBatteryState["batteryState"]["batteryState"] = "UNKNOWN";

            switch(newBatteryState.batteryState) {
                case Battery.BatteryState.UNKNOWN: {
                    chargingState = "UNKNOWN";

                    break;
                }
                
                case Battery.BatteryState.CHARGING: {
                    chargingState = "CHARGING";

                    break;
                }
                
                case Battery.BatteryState.UNPLUGGED: {
                    chargingState = "UNPLUGGED";

                    break;
                }
                
                case Battery.BatteryState.FULL: {
                    chargingState = "FULL";

                    break;
                }
            }


            if(!session.batteryStates.length ||
                previousBatteryState.batteryState.batteryLevel !== newBatteryState.batteryLevel ||
                previousBatteryState.batteryState.batteryState !== chargingState ||
                previousBatteryState.batteryState.lowPowerMode !== newBatteryState.lowPowerMode) {

                console.log("Received battery state: " + JSON.stringify(newBatteryState));
    
                if(instance.active) {
                    session.batteryStates.push({
                        batteryState: {
                            batteryLevel: newBatteryState.batteryLevel,
                            batteryState: chargingState,
                            lowPowerMode: newBatteryState.lowPowerMode
                        },
                        timestamp: Date.now()
                    });
                }
            }
        });
    };
};
