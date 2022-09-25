import http from "http";

export default class Server {
    static server = null;

    static listen(settings) {
        this.server = http.createServer((...args) => this.onRequest(...args)).listen(settings.port);

        console.log("Listening to port " + settings.port);
    };

    static requests = [];

    static async onRequest(request, response) {
        try {
            console.log(request.socket.remoteAddress + " > " + request.method + " " + request.url);

            response.writeProcessing();
        
            const url = request.url.toLowerCase();
            const queryIndex = url.indexOf('?');
            const path = (queryIndex == -1)?(request.url):(request.url.substring(0, queryIndex));

            const listener = this.requests.find(x => x.method == request.method && x.path == path);

            if(!listener)
                throw new Error("Listener does not exist!");

            let result = null;

            if(listener.method == "GET" && queryIndex != -1) {
                const query = url.substr(queryIndex + 1, url.length).split('&');

                let parameters = {};

                for(let index = 0; index < query.length; index++) {
                    const pair = query[index].split('=');

                    parameters[pair[0]] = pair[1];
                }

                result = await listener.response(request, response, parameters);
            }
            else if(request.method == "POST" && queryIndex != -1) {
                const body = JSON.parse(await this.downloadBodyAsync(request));
                
                result = await listener.response(request, response, body);
            }
            else if(request.method == "PUT" && queryIndex != -1) {
                const body = await this.downloadBodyAsync(request);
                
                result = await listener.response(request, response, body);
            }
            else
                result = await listener.response(request, response);

            if(typeof result == "object")
                result = JSON.stringify(result);

            response.writeHead(200, {
                "Content-Type": "text/json"
            });
        
            response.end(result);
        }
        catch(error) {
            console.error(request.socket.remoteAddress + ": " + error);
        }
        finally {
            response.end();
        }
    };

    static async downloadBodyAsync(request) {
        return new Promise((resolve) => {
            let body = "";

            this.request.on("data", (chunck) => {
                body += chunck;
            });

            this.request.on("end", async () => {
                resolve(body);
            });
        });
    };

    static on(method, path, response, requiredParameters = undefined) {
        if(this.requests.find(x => x.method == method && x.path == path))
            throw new Error("Duplicate entry for " + method + " " + path);

        this.requests.push({ method, path, response, requiredParameters });
    };
};
