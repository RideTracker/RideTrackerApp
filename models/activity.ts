import Constants from "expo-constants";
import { Response } from "./response";
import { useSelector } from "react-redux";

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

export async function getActivityById(authorization: string, id: string): Promise<ActivityResponse> {
    const url = new URL(`activity/${id}`, Constants.expoConfig.extra.apiHost);

    const response = await fetch(url, {
        headers: {
            "Authorization": authorization
        }
    });
    const result = await response.json();

    console.log(result);

    return result;
};
