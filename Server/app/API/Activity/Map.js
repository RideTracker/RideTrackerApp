import fs from "fs";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("GET", "/api/activity/map", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false, content: "No activity found!" };

    return JSON.parse(fs.readFileSync("./app/uploads/activities/" + parameters.id + ".json"));
}, [ "id" ]);
