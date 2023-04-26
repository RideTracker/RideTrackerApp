import Constants from "expo-constants";
import { Response } from "./response";
import { useSelector } from "react-redux";

export type FeedResponse = Response & {
    activities: string[];
};

export async function getFeed(authorization: string, filter: Record<string, string> | null): Promise<FeedResponse> {
    const url = new URL("/api/feed", Constants.expoConfig.extra.api);

    if(filter)
        Object.entries(filter).forEach(([ key, value ]) => url.searchParams.append(key, value))

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });

    const result = await response.json();

    console.log(url, result);

    return result;
};
