import { request } from "../request";

export function getBikeById(key: string, id: string) {
    return request("GET", `/api/bikes/${id}`, null, key);
}