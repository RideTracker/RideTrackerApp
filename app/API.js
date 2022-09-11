export default class API {
    static server = "http://172.20.10.2:8080/";

    static async fetch(path, method, body) {
        console.log("API: " + method + " " + path);

        const response = await fetch(API.server + path, { method, body });
        
        const result = await response.json();

        if(result.success == false)
            throw new Error(result.content);

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
};
