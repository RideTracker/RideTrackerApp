export function getFormattedActivitySummary(key: string, value: number): { name: string, altName?: string, value: number, unit: string } {
    switch(key) {
        case "activities": {
            return {
                name: "activities",
                value,
                unit: "activities"
            };
        }
        
        case "distance": {
            return {
                name: "distance",
                value: Math.round((value / 1000) * 10) / 10,
                unit: "km"
            };
        }
        
        case "average_speed": {
            return {
                name: "average speed",
                altName: "avg.speed",
                value: Math.round((value * 3.6) * 10) / 10,
                unit: "km/h"
            };
        }
        
        case "max_speed": {
            return {
                name: "max speed",
                value: Math.round((value * 3.6) * 10) / 10,
                unit: "km/h"
            };
        }
        
        case "elevation": {
            return {
                name: "elevation",
                value: Math.round(value),
                unit: "m"
            };
        }
    }

    return null;
};
