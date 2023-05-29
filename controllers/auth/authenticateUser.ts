import { request } from "../request";

export function authenticateUser(key: string) {
    return request("POST", "/api/auth/renew", null, key);
}
