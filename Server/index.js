const fs = require("fs");
const http = require("http");
const mysql = require("mysql");
const ApiResponse = require("./app/API/ApiResponse");
const ActivityRequest = require("./app/API/Activity/ActivityRequest");

const global = require("./global");

const config = JSON.parse(fs.readFileSync("./config.json"));

global.connection = mysql.createConnection(config.mysql);

global.connection.connect((error) => {
    if(error)
        console.log(error);

    const requests = [
        require("./app/API/Ping/Ping"),
        
        require("./app/API/User/UserRequest"),

        require("./app/API/Activity/ActivityRequest"),
        require("./app/API/Activity/Map/ActivityMapRequest"),
        require("./app/API/Activity/Summary/ActivitySummaryRequest"),

        require("./app/API/Feed/ActivitiesRequest")
    ];

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

            if(indexOfGet != -1)
                url = url.substring(0, indexOfGet);

            if(url.startsWith("/api/")) {
                url = url.substring("/api".length);

                const ApiRequest = requests.find(x => x.path == url);

                const apiRequest = new ApiRequest(request);

                response.writeHead(200, {
                    "Content-Type": "text/json"
                });

                const apiResponse = await apiRequest.respond();
            
                response.write(JSON.stringify(apiResponse));

                console.log(request.socket.remoteAddress + " 200 OK");

                return;
            }

            const indexOfExtension = url.indexOf('.');

            if(!fs.existsSync("./app/public/" + url)) {
                response.writeHead(404);
                
                console.log(request.socket.remoteAddress + " 404 File Not Found");

                return;
            }

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
