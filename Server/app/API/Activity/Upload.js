import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("PUT", "/api/activity/upload", async (request, response, body) => {
    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO activities (id, user, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(1)}, ${Database.connection.escape(Date.now())})`);
    
    fs.writeFileSync("./app/uploads/activities/" + id + ".json", body);
    
    return { success: true, content: id };
});
