import { request } from "../request";

export function getProfileById(key: string, user: string) {
    return request("GET", `/api/profiles/${user}`, null, key);
}
