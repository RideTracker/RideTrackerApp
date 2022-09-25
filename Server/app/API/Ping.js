import Server from "../Server.js";

Server.on("GET", "/api/ping", async (request, response) => {
    return "pong!";
});
