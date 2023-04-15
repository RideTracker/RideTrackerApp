import Constants from "expo-constants";

export async function getAvatars(authorization: string) {
    const url = new URL(`/api/avatars`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",
        
        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    
    const result = await response.json();

    console.log("/api/avatars", result);

    return result;
};
