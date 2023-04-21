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

export async function createUserAvatar(authorization: string, combination: any, image: string) {
    const url = new URL(`/api/user/avatar`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "POST",
        
        headers: {
            "Authorization": `Bearer ${authorization}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            combination, image
        })
    });
    
    const result = await response.json();

    console.log("/api/user/avatar", result);

    return result;
};
