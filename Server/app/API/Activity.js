import Server from "../Server.js";
import Database from "../Database.js";

Server.on("GET", "/api/activity", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false, content: "No activity found!" };

    return {
        success: true,
        content: {
            id: rows[0].id,
            user: rows[0].user,
            timestamp: rows[0].timestamp
        }
    };
}, [ "id" ]);
