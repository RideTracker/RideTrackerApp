import { request } from "../request";

export function getBikes(key: string) {
    return request("GET", "/api/bikes", null, key);
};