const fs = require("fs");
const http = require("http");
const mysql = require("mysql");

const global = require("./global");

const config = JSON.parse(fs.readFileSync("./config.json"));

const requests = config.requests.map((file) => require(file));

global.connection = mysql.createConnection(config.mysql);

global.connection.connect((error) => {
    if(error)
        console.log(error);

    const server = http.createServer(async (request, response) => {
        try {
            console.log(request.socket.remoteAddress + " " + request.method + " " + request.url);

            if(request.method == "PUT") {
                let body = "";

                request.on("data", (chunck) => {
                    body += chunck;
                });

                request.on("end", async () => {
                    console.log(body);

                    response.writeHead(200, {
                        "Content-Type": "text/json"
                    });
                
                    response.write(JSON.stringify({
                        succcess: true,
                        content: null
                    }));

                    console.log(request.socket.remoteAddress + " 200 OK");
                });

                return;
            }

            let url = request.url.toLowerCase();

            const indexOfGet = url.indexOf('?');
            const indexOfExtension = url.indexOf('.');

            if(indexOfGet != -1)
                url = url.substring(0, indexOfGet);

        
            if(indexOfExtension != -1 && fs.existsSync("./app/public/" + url)) {
                const contentTypes = {
                    ".html": "text/html",
                    ".css": "text/css",
                    ".js": "text/javascript",
                    ".json": "text/json"
                };

                const extension = url.substring(indexOfExtension, url.length);

                response.writeHead(200, {
                    "Content-Type": contentTypes[extension]
                });
            
                response.write(fs.readFileSync("./app/public/" + url));

                console.log(request.socket.remoteAddress + " 200 OK");
            }
            else {
                const ApiRequest = requests.find(x => x.path == url);

                if(ApiRequest != null) {
                    const apiRequest = new ApiRequest(request);

                    response.writeHead(200, {
                        "Content-Type": "text/json"
                    });

                    const apiResponse = await apiRequest.respond();
                
                    response.write(JSON.stringify(apiResponse));

                    console.log(request.socket.remoteAddress + " 200 OK");
                }
                else {
                    response.writeHead(404);
                
                    console.log(request.socket.remoteAddress + " 404 File Not Found");
                }
            }
        }
        catch(error) {
            console.log(error);

            if(error.hasOwnProperty("success")) {
                response.writeHead(200, {
                    "Content-Type": "text/json"
                });
            
                response.write(JSON.stringify(error));
            }
        }
        finally {
            response.end();
        }
    });
    
    server.listen(8080);
});
