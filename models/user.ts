import Constants from "expo-constants";
import { Response } from "./response";

export type UserResponse = Response & {
    id: string;
    user: string;

    timestamp: number;
};

export async function getUserById(id: string): Promise<UserResponse> {
    const url = new URL(`user/${id}`, Constants.expoConfig.extra.apiHost);

    const response = await fetch(url);
    const result = await response.json();

    return result;
};

export type AuthenticateUserResponse = Response & {
    key?: string;
    user?: {
        name: string;
        avatar?: string;
    }
};

export async function loginUser(email: string, password: string): Promise<AuthenticateUserResponse> {
    const url = new URL(`guest/login`, Constants.expoConfig.extra.apiHost);

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

export async function registerUser(firstname: string, lastname: string, email: string, password: string): Promise<AuthenticateUserResponse> {
    const url = new URL(`guest/register`, Constants.expoConfig.extra.apiHost);

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

export async function authenticateUser(key: string): Promise<AuthenticateUserResponse> {
    const url = new URL(`guest/authenticate`, Constants.expoConfig.extra.apiHost);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key
        })
    });

    const result = await response.json();

    console.log("authenticate", result);

    return result;
};
