import { request } from "../../request";

export function getActivityComments(key: string, id: string) {
    return request("GET", `/api/activities/${id}/comments`, null, key);
};