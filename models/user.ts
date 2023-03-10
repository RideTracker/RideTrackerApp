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

export type RegisterUserResponse = Response & {
    token?: string;
};

export async function registerUser(firstname: string, lastname: string, email: string, password: string): Promise<RegisterUserResponse> {
    const url = new URL(`user/register`, Constants.expoConfig.extra.apiHost);

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

    console.log(result);

    return result;
};
