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
