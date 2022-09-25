import fs from "fs";

import global from "./global.js";

import Database from "./app/Database.js";
import Server from "./app/Server.js";

global.config = JSON.parse(fs.readFileSync("./config.json"));

import "./app/API.js";

(async () => {
    await Database.connectAsync(global.config.database);

    Server.listen(global.config.server);
})();
