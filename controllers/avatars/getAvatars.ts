import { request } from "../request";

export function getAvatars(key: string) {
    return request("GET", "/api/avatars", null, key);
}
