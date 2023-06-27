import { MapMarkerProps, Marker } from "react-native-maps";

const image = require("../../assets/extras/map/finish.png");

export default function MapFinishMarker(props: MapMarkerProps) {
    return (
        <Marker {...props} flat={true} image={image} anchor={{
            x: 0.5,
            y: 0.5
        }}/>
    );
};
