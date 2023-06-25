import { MapMarkerProps, Marker } from "react-native-maps";

const image = require("../../assets/extras/map/intermediate.png");

export default function MapIntermediateMarker(props: MapMarkerProps) {
    return (
        <Marker {...props} image={image} anchor={{
            x: 0.5,
            y: 0.5
        }}/>
    );
};
