import { request } from "../request";

export async function getFeed(key: string, filter: Record<string, string> | null) {
    const url = new URL("/api/feed");

    if(filter)
        Object.entries(filter).forEach(([ key, value ]) => url.searchParams.append(key, value))

    return request("GET", url, null, key);
};
