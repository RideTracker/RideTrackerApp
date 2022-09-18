import { getPreciseDistance } from "geolib";

export default class Recording {
    constructor(data) {
        this.data = data;
    };

    getLatLngCoordinates() {
        const sections = [];

        for(let index = 0; index < this.data.sections.length; index++) {
            sections.push({
                index,

                coordinates: this.data.sections[index].coordinates.map(x => {
                    return {
                        latitude: x.coords.latitude,
                        longitude: x.coords.longitude
                    }
                })
            });
        }

        return sections;
    };

    getAllLatLngCoordinates() {
        let coordinates = [];

        this.data.sections.map(section => {
            section.coordinates.map(x => {
                coordinates.push({
                    latitude: x.coords.latitude,
                    longitude: x.coords.longitude
                });
            });
        });

        return coordinates;
    };

    getAllCoordinates() {
        let coordinates = [];
        
        for(let index = 0; index < this.data.sections.length; index++)
            coordinates = coordinates.concat(this.data.sections[index].coordinates.map((coordinate) => coordinate.coords))

        return coordinates;
    };

    getAverageSpeed() {
        const speeds = this.getAllCoordinates().map((coordinate) => coordinate.speed);

        if(speeds.length == 0)
            return 0;

        const averageMetersPerSecond = speeds.reduce((a, b) => (a + b)) / speeds.length;

        const averageKilometersPerHour = averageMetersPerSecond * 3.6;

        return Math.round(averageKilometersPerHour * 10) / 10;
    };

    getAverageDistance() {
        const coordinates = this.getAllCoordinates();

        let distance = 0;
        
        for(let index = 0; index < coordinates.length - 1; index++) {
            const accuracy = [
                coordinates[index].accuracy,
                coordinates[index + 1].accuracy
            ];

            distance += getPreciseDistance(
                {
                    latitude: coordinates[index].latitude,
                    longitude: coordinates[index].longitude
                },

                {
                    latitude: coordinates[index + 1].latitude,
                    longitude: coordinates[index + 1].longitude
                },

                accuracy.reduce((a, b) => (a + b)) / accuracy.length
            );
        }

        const kilometers = distance / 1000;

        return Math.round(kilometers * 10) / 10;
    }
};
