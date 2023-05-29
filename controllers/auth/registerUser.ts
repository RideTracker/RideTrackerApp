import { request } from "../request";

export function registerUser(firstname: string, lastname: string, email: string, password: string) {
    return request("POST", "/api/auth/register", { firstname, lastname, email, password }, null);
}
