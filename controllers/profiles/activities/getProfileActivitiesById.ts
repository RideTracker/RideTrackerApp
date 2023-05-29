import { request } from "../../request";

export function getProfileActivitiesById(key: string, user: string, offset: number) {
    return request("POST", `/api/profiles/${user}/activities`, { offset }, key);
}
