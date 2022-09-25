import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("POST", "/api/user/login", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM users WHERE email = ${Database.connection.escape(parameters.email)} LIMIT 1`);
    
    if(rows.length == 0)
        return { success: false, content: "This e-mail address isn't registered to any users!" };

    const match = await bcrypt.compare(parameters.password, rows[0].password);
    
    if(!match)
        return reject(new ApiResponse(false, "Your credentials does not match!"));

    const token = uuidv4();

    await Database.queryAsync(`INSERT INTO user_tokens (id, user) VALUES (${Database.connection.escape(token)}, ${Database.connection.escape(rows[0].id)})`);

    return { success: true, content: token };
}, [ "email", "password" ]);
