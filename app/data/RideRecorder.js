import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { TouchableHighlightBase } from 'react-native';
import uuid from 'react-native-uuid';

import Files from "../data/Offline";

export default class RideRecorder {
    id = uuid.v4();
    active = false;

    sections = [];
    section = null;

    version = 1;

    started = null;
    ended = null;

    constructor(start) {
        TaskManager.defineTask("recorder-" + this.id, ({ data, error }) => {
            if(error)
                return;
            
            if(data) {
                const { locations } = data;

                this.onPosition(locations);
            }
        });

        if(start)
            this.start();
    };

    getSpeed() {
        if(this.sections.length == 0)
            return 0;

        const section = this.sections.length - 1;

        if(this.sections[section].coordinates.length < 2)
            return 0;

        const coordinate = this.sections[section].coordinates.length - 1;

        //const latitude = this.sections[section].coordinates[coordinate].coords.latitude - this.sections[section].coordinates[coordinate - 1].coords.latitude;
        //const longitude = this.sections[section].coordinates[coordinate].coords.longitude - this.sections[section].coordinates[coordinate - 1].coords.longitude;
    
        return (this.sections[section].coordinates[coordinate].coords.speed ?? 0) * 3.6;
    };

    getDuration() {
        let milliseconds = 0;

        for(let section = 0; section < this.sections.length - 1; section++)
            milliseconds += this.sections[section].end - this.sections[section].start;

        milliseconds += ((this.active)?(new Date().getTime()):(this.sections[this.sections.length - 1].end)) - this.sections[this.sections.length - 1].start;

        return milliseconds;
    };

    getCoordinatesDuration() {
        let milliseconds = 0;

        for(let section = 0; section < this.sections.length; section++) {
            if(this.sections[section].coordinates.length < 2)
                continue;

            const first = this.sections[section].coordinates[0];
            const last = this.sections[section].coordinates[this.sections[section].coordinates.length - 1];

            milliseconds += first.timestamp - last.timestamp;
        }

        return milliseconds;
    };

    toggle() {
        if(this.active == true)
            this.stop();
        else
            this.start();
    };

    start() {
        if(this.started == null)
            this.started = new Date().getTime();

        this.active = true;

        this.section = this.sections.push({
            start: new Date().getTime(),
            coordinates: []
        }) - 1;

        Location.startLocationUpdatesAsync("recorder-" + this.id, {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 10000,
            foregroundService: {
                notificationTitle: "App Name",
                notificationBody: "Location is used when App is in background",
            },
            activityType: Location.ActivityType.AutomotiveNavigation,
            showsBackgroundLocationIndicator: true,
        });
    };

    stop() {
        if(this.ended == null)
            this.ended = new Date().getTime();

        this.active = false;

        this.sections[this.section].end = new Date().getTime();
        
        this.section = -1;

        Location.stopLocationUpdatesAsync("recorder-" + this.id);
    };

    async save() {
        const content = JSON.stringify({
            meta: {
                version: this.version,

                started: this.started,
                ended: this.ended,

                active: this.active
            },

            sections: this.sections
        });

        await Files.createFile("rides", this.id + ".json", content);
        
        return content;
    };
    
    onPosition(locations) {
        if(!this.active)
            return;

        for(let index = 0; index < locations.length; index++) {
            console.log(locations[index]);

            this.sections[this.section].coordinates.push(locations[index]);
        }
    };
};
