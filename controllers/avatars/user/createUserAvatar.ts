import { request } from "../../request";

export function createUserAvatar(key: string, combination: any, image: string) {
    return request("POST", "/api/user/avatar", { combination, image }, key);
};