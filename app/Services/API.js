import Constants from "expo-constants";

import JsonMessage from "@nora-soderlund/json-messages";

import Config from "app/Data/Config";

import Settings from "app/Settings";
import Production from "app/Services/Production";

export default class API {
    static alive = null;
    static timestamp = null;

    static async getManifestAsync() {
        API.manifest = await this.get("/api/v1/manifest");

        console.log(JSON.stringify(this.manifest));
    };

    static async ping(forced = false) {
        if(forced == false) {
            if(this.timestamp != null)
                return this.alive; 
        }
        
        return new Promise((resolve) => {
            const timestamp = Date.now().getTime();
    
            this.get("/ping", {
                timestamp
            }).then((result) => {
                this.alive = true;
                this.timestamp = result.timestamp;
    
                resolve(this.alive);
            }).catch(() => {
                this.alive = false;
                this.timestamp = null;
            }).finally(() => {
                resolve(this.alive);
            });
        });
    };

    static async fetch(path, method, body) {
        console.log(method + " " + Settings.api + path);

        const headers = new Headers();

        if(Config.user?.token)
            headers.set("Authorization", `Bearer ${Config.user.token}`);

        headers.set("User-Agent", `RideTracker-${Constants.manifest.version}-${Production.get()}`);

        try {
            const response = await fetch(Settings.api + path, {
                method,
                headers,
                body: JSON.stringify(body)
            });

            const text = await response.text();

            if(text[0] == '*') {
                console.log(text);
                
                const object = JsonMessage.decompressWithoutHeader(API.manifest, path.substring(0, path.indexOf('?')), text);

                console.log(object);

                const result = { success: true, content: object };
            
                return result;
            }
            
            return JSON.parse(text);
        }
        catch(error) {
            console.error(method + " " + Settings.api + path + ": " + error);

            return {
                error: true
            };
        }
    };

    static async get(path, parameters) {
        if(parameters == undefined)
            return await this.fetch(path, "GET");

        let sections = [];

        for(let key in parameters)
            sections.push(key + "=" + parameters[key]);

        return await this.fetch(path + "?" + sections.join("&"), "GET");
    };

    static async put(path, body) {
        if(body == undefined)
            return await this.fetch(path, "PUT");

        return await this.fetch(path, "PUT", body);
    };

    static async post(path, body) {
        if(body == undefined)
            return await this.fetch(path, "POST");

        return await this.fetch(path, "POST", body);
    };

    static async delete(path, parameters) {
        if(parameters == undefined)
            return await this.fetch(path, "DELETE");

        let sections = [];

        for(let key in parameters)
            sections.push(key + "=" + parameters[key]);

        return await this.fetch(path + "?" + sections.join("&"), "DELETE");
    };
};
