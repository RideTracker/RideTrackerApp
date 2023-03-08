import Constants from "expo-constants";
import { Response } from "./response";

export type FeedResponse = Response & {
    activities: string[];
};

export async function getFeed(): Promise<FeedResponse> {
    const url = new URL("feed", Constants.expoConfig.extra.apiHost);

    const response = await fetch(url);
    const result = await response.json();

    return result;
};
