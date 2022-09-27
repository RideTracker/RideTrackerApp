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

    static server = "http://172.20.10.4:8080";

    static async fetch(path, method, body) {
        console.log("API FETCH " + method + " " + path);

        const response = await fetch(API.server + path, { method, body: JSON.stringify(body) });
        
        if(method == "PUT")
            return {};
            
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
};
