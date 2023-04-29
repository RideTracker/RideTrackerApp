import Constants from "expo-constants";
import { Response } from "./response";
import { useSelector } from "react-redux";
import { BikeResponse } from "./bike";

export async function getActivityById(authorization: string, id: string) {
    const url = new URL(`/api/activities/${id}`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    const result = await response.json();

    console.log(result);

    return result;
};

export async function getActivitySummaryById(authorization: string, id: string) {
    const url = new URL(`/api/activities/${id}/summary`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    const result = await response.json();

    console.log(result);

    return result;
};

export async function getActivityComments(authorization: string, id: string) {
    const url = new URL(`/api/activities/${id}/comments`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    const result = await response.json();

    console.log(result);

    return result;
};

export async function getActivityCommentsSummary(authorization: string, id: string) {
    const url = new URL(`/api/activities/${id}/comments/summary`, Constants.expoConfig.extra.api);

    console.log(url);

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    const result = await response.json();

    console.log(result);

    return result;
};
