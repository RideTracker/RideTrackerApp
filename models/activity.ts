import Constants from "expo-constants";
import { Response } from "./response";

export type ActivityResponse = Response & {
    id: string;

    user: {
        id: string;
        name: string;
        avatar: string;
    };

    bike: string | null;

    timestamp: number;
};

export async function getActivityById(id: string): Promise<ActivityResponse> {
    const url = new URL(`activity/${id}`, Constants.expoConfig.extra.apiHost);

    const response = await fetch(url);
    const result = await response.json();

    return result;
};
