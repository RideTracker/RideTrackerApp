import Constants from "expo-constants";
import { Response } from "./response";
import { useSelector } from "react-redux";

export type FeedResponse = Response & {
    activities: string[];
};

export async function getFeed(authorization: string): Promise<FeedResponse> {
    const url = new URL("/api/feed", Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });

    const result = await response.json();

    console.log("/api/feed", result);

    return result;
};
