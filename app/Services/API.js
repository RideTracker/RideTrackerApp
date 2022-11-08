import Config from "app/Data/Config";

import Settings from "app/Settings";

export default class API {
    static alive = null;
    static timestamp = null;

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
        console.log("API FETCH " + method + " " + Settings.api + path);

        const headers = new Headers();

        if(Config.user?.token)
            headers.set("Authorization", `Bearer ${Config.user.token}`);

        const response = await fetch(Settings.api + path, {
            method,
            headers,
            body: JSON.stringify(body)
        });
            
        const result = await response.json();

        return result;
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
