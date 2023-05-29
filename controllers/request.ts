import Constants from "expo-constants";

export async function request(method: string, uri: URL | string, body: any | null, key: string | null) {
    const url = new URL(uri.toString(), Constants.expoConfig.extra.api);

    console.log(`${method} ${url.toString()}...`);

    const response = await fetch(url, {
        method: method,
        headers: {
            "Authorization": key && `Bearer ${key}`,

            "Content-Type": "application/json"
        },
        body: body && JSON.stringify(body)
    });

    console.log(`Received ${uri}: ` + response.status + " " + response.statusText);

    const text = await response.text();

    try {
        return JSON.parse(text);
    }
    catch(error) {
        console.error("Can not parse " + uri + ": " + text);

        return { success: false };
    }
}
