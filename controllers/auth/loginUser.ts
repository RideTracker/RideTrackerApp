import { request } from "../request";

export function loginUser(email: string, password: string) {
    return request("POST", "/api/auth/login", { email, password }, null);
};
