import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { TouchableHighlightBase } from 'react-native';
import uuid from 'react-native-uuid';

import Files from "./Files";

import Recording from "./Recording";

export default class Recorder extends Recording {
    active = false;

    section = null;

    constructor(start) {
        super({
            meta: {
                id: uuid.v4(),
                version: 1,
    
                started: null,
                ended: null
            },
    
            sections: []
        });

        TaskManager.defineTask("recorder-" + this.data.id, ({ data, error }) => {
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
        if(this.data.sections.length == 0)
            return 0;

        const section = this.data.sections.length - 1;

        if(this.data.sections[section].coordinates.length < 2)
            return 0;

        const coordinate = this.data.sections[section].coordinates.length - 1;

        //const latitude = this.data.sections[section].coordinates[coordinate].coords.latitude - this.data.sections[section].coordinates[coordinate - 1].coords.latitude;
        //const longitude = this.data.sections[section].coordinates[coordinate].coords.longitude - this.data.sections[section].coordinates[coordinate - 1].coords.longitude;
    
        return (this.data.sections[section].coordinates[coordinate].coords.speed ?? 0) * 3.6;
    };

    getDuration() {
        let milliseconds = 0;

        for(let section = 0; section < this.data.sections.length - 1; section++)
            milliseconds += this.data.sections[section].end - this.data.sections[section].start;

        milliseconds += ((this.active)?(new Date().getTime()):(this.data.sections[this.data.sections.length - 1].end)) - this.data.sections[this.data.sections.length - 1].start;

        return milliseconds;
    };

    getCoordinatesDuration() {
        let milliseconds = 0;

        for(let section = 0; section < this.data.sections.length; section++) {
            if(this.data.sections[section].coordinates.length < 2)
                continue;

            const first = this.data.sections[section].coordinates[0];
            const last = this.data.sections[section].coordinates[this.data.sections[section].coordinates.length - 1];

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
        if(this.data.started == null)
            this.data.started = new Date().getTime();

        this.active = true;

        this.section = this.data.sections.push({
            start: new Date().getTime(),
            coordinates: []
        }) - 1;

        try {
            Location.startLocationUpdatesAsync("recorder-" + this.data.id, {
                accuracy: Location.Accuracy.BestForNavigation,
                timeInterval: 10000,
                foregroundService: {
                    notificationTitle: "App Name",
                    notificationBody: "Location is used when App is in background",
                },
                activityType: Location.ActivityType.Fitness,
                showsBackgroundLocationIndicator: true,
            });
        }
        catch(error) {
            console.info(error);
        }
    };

    stop() {
        if(this.data.ended == null)
            this.data.ended = new Date().getTime();

        this.active = false;

        this.data.sections[this.section].end = new Date().getTime();
        
        this.section = -1;

        Location.stopLocationUpdatesAsync("recorder-" + this.data.id);
    };

    async save() {
        await Files.createFile("rides", this.data.id + ".json", JSON.stringify(this.data));
        
        return content;
    };
    
    onPosition(locations) {
        if(!this.active)
            return;

        for(let index = 0; index < locations.length; index++)
            this.data.sections[this.section].coordinates.push(locations[index]);
    };
};
