import Constants from "expo-constants";

export async function request(method: string, uri: URL | string, body: any | null, key: string | null) {
    const url = new URL(uri.toString(), Constants.expoConfig.extra.api);

    console.log(`Fetching ${url}...`);

    const response = await fetch(url, {
        method: method,
        headers: {
            "Authorization": key && `Bearer ${key}`,

            "Content-Type": "application/json"
        },
        body: body && JSON.stringify(body)
    });

    console.log(`Received ${url}: ` + response.status + " " + response.statusText);

    const result = await response.json();
    
    return result;
};
