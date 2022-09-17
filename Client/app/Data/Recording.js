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
};
