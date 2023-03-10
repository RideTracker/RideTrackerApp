import Constants from "expo-constants";
import { Response } from "./response";
import { useSelector } from "react-redux";

export type FeedResponse = Response & {
    activities: string[];
};

export async function getFeed(authorization: string): Promise<FeedResponse> {
    const url = new URL("feed", Constants.expoConfig.extra.apiHost);

    const response = await fetch(url, {
        headers: {
            "Authorization": authorization
        }
    });

    const result = await response.json();

    return result;
};
