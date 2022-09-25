import Server from "../Server.js";
import Database from "../Database.js";

Server.on("GET", "/api/user", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM users WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);
    
    if(rows.length == 0)
        return { success: false };

    return {
        success: true,

        content: {
            id: rows[0].id,
            slug: rows[0].slug,
            name: rows[0].firstname + " " + rows[0].lastname
        }
    };
});
