import { MapMarkerProps, Marker } from "react-native-maps";

const image = require("../../assets/extras/map/start_finish.png");

export default function MapStartFinishMarker(props: MapMarkerProps) {
    return (
        <Marker {...props} image={image} anchor={{
            x: 0.5,
            y: 0.5
        }}/>
    );
};
