import Constants from "expo-constants";
import { Response } from "./response";
import { useSelector } from "react-redux";

export type BikeResponse = Response & {
    id: string;
    user: string;

    name: string;
    model: string;

    image: string;

    summary?: {
        rides: number;
        distance: number;
        elevation: number;
    };
};

export async function getBikeById(authorization: string, id: string) {
    const url = new URL(`/api/bikes/${id}`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",
        
        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    
    const result = await response.json();

    console.log(`/api/bikes/${id}`, result);

    return result;
};

export async function getBikes(authorization: string): Promise<any> {
    const url = new URL(`/api/bikes`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",
        
        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    
    const result = await response.json();

    console.log("/api/bikes", result);

    return result;
};
