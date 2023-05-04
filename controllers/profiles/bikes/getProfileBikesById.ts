import { request } from "../../request";

export async function getProfileBikesById(key: string, user: string, offset: number) {
    return request("POST", `/api/profiles/${user}/bikes`, { offset }, key);
};
