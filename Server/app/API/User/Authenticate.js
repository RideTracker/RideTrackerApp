import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("POST", "/api/user/authenticate", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false, content: "Authentication failed!" };

    Database.queryAsync(`DELETE FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)}`);

    const newToken = uuidv4();
    await Database.queryAsync(`INSERT INTO user_tokens (id, user) VALUES (${Database.connection.escape(newToken)}, ${Database.connection.escape(rows[0].user)})`);

    return { success: true, content: { id: rows[0].user, token: newToken } };
}, [ "token" ]);
