import { request } from "../request";

export function getActivityById(key: string, id: string) {
    return request("GET", `/api/activities/${id}`, null, key);
};
