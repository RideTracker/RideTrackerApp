let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        disableDefaultUI: true,
        mapId: "9acd0f519421f310"
    });

    fetch("/map.json").then(response => response.json()).then((result) => {
        const polyline = new google.maps.Polyline({     
            path: result.coordinates,    
            geodesic: true,
            strokeColor: "#FFFFFF",
            strokeOpacity: 1.0,
            strokeWeight: 2
        });    

        polyline.setMap(map);

        const bounds = new google.maps.LatLngBounds();
        const points = polyline.getPath().getArray();
        
        for(let index = 0; index < points.length; index++)
            bounds.extend(points[index]);

        map.fitBounds(bounds);
    });
}

window.initMap = initMap;
