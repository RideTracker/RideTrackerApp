import Constants from "expo-constants";
import { Response } from "./response";

export type UserResponse = Response & {
    id: string;
    user: string;

    timestamp: number;
};

export type AuthenticateUserResponse = Response & {
    key?: string;
    user?: {
        name: string;
        avatar?: string;
    }
};

export async function loginUser(email: string, password: string) {
    const url = new URL(`/api/auth/login`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const result = await response.json();

    console.log(result);

    return result;
};

export async function registerUser(firstname: string, lastname: string, email: string, password: string) {
    const url = new URL(`/api/auth/register`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstname,
            lastname,
            email,
            password
        })
    });

    const result = await response.json();

    return result;
};

export async function verifyUser(verification: string, code: string): Promise<AuthenticateUserResponse> {
    const url = new URL(`/api/auth/login/verify`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: verification,
            code
        })
    });

    const result = await response.json();

    console.log(result);

    return result;
};

export async function getProfileById(key: string, user: string) {
    const url = new URL(`/api/profiles/${user}`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    console.log(result);

    return result;
};

export async function getProfileActivitiesById(key: string, user: string, offset: number) {
    const url = new URL(`/api/profiles/${user}/activities`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            offset
        })
    });

    const result = await response.json();

    console.log(result);

    return result;
};

export async function getProfileBikesById(key: string, user: string, offset: number) {
    const url = new URL(`/api/profiles/${user}/bikes`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            offset
        })
    });

    const result = await response.json();

    console.log(result);

    return result;
};

export async function authenticateUser(key: string): Promise<AuthenticateUserResponse> {
    const url = new URL(`/api/auth/renew`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${key}`,

            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    console.log("authenticate", result);

    return result;
};

export async function authenticateRandomUser() {
    const url = new URL(`/staging/user`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    return await authenticateUser(result.key);
};
