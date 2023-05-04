import { request } from "../../request";

export function getActivitySummaryById(key: string, id: string) {
    return request("GET", `/api/activities/${id}/summary`, null, key);
};