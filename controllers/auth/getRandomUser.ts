import { request } from "../request";

export function getRandomUser() {
    return request("GET", "/staging/user", null, null);
};