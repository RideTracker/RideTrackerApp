import { request } from "../../../request";

export function getActivityCommentsSummary(key: string, id: string) {
    return request("GET", `/api/activities/${id}/comments/summary`, null, key);
};
