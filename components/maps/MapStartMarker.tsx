import { MapMarkerProps, Marker } from "react-native-maps";

const image = require("../../assets/extras/map/start.png");

export default function MapStartMarker(props: MapMarkerProps) {
    return (
        <Marker {...props} image={image} anchor={{
            x: 0.5,
            y: 0.5
        }}/>
    );
};
