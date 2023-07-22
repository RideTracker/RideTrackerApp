import { LayoutRectangle } from "react-native";

export default function getMapZoomByBounds(bounds: {
    maxLat: number;
    maxLng: number;
    
    minLat: number;
    minLng: number;
}, layout: LayoutRectangle) {
    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function getZoom(mapPx, worldPx, fraction) {
        return Math.log(mapPx / worldPx / fraction) / Math.LN2;
    }

    var latFraction = (latRad(bounds.maxLat) - latRad(bounds.minLat)) / Math.PI;

    var lngDiff = bounds.maxLng - bounds.minLng;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = getZoom(layout.width, 256, latFraction);
    var lngZoom = getZoom(layout.height, 256, lngFraction);

    return Math.min(latZoom, lngZoom, 21);
};
