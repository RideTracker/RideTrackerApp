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

export async function getBikeById(authorization: string, id: string): Promise<BikeResponse> {
    const url = new URL(`bike/${id}`, Constants.expoConfig.extra.apiHost);

    const response = await fetch(url, {
        headers: {
            "Authorization": authorization
        }
    });
    const result = await response.json();

    return result;
};
