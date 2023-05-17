import Constants from "expo-constants";
import { request } from "../request";

export async function getFeed(key: string, offset: number = 0, filter: Record<string, string> | null) {
    const url = new URL("/api/feed", "");

    if(filter)
        Object.entries(filter).forEach(([ key, value ]) => url.searchParams.append(key, value));

    url.searchParams.append("offset", offset.toString());

    return request("GET", url, null, key);
};
