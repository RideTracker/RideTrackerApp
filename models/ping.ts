import Constants from "expo-constants";
import { Response } from "./response";

export type PingResponse = Response & {
    ping: string;
};

export async function ping(validation: boolean): Promise<PingResponse> {
    const url = new URL("/api/ping", Constants.expoConfig.extra.api);

    const response = await fetch(url);
    const result = await response.json();

    return result;
};
