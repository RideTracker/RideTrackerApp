import { request } from "../request";

export async function verifyUser(id: string, code: string) {
    return request("POST", "/api/auth/login/verify", { id, code }, null);
}