import Constants from "expo-constants";
import { Response } from "./response";

export type BikeResponse = Response & {
    id: string;
    user: string;

    name: string;
    model: string;

    image: string;
};

export async function getBikeById(id: string): Promise<BikeResponse> {
    const url = new URL(`bike/${id}`, Constants.expoConfig.extra.apiHost);

    const response = await fetch(url);
    const result = await response.json();

    return result;
};
