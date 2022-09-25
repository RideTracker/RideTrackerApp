import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("POST", "/api/user/register", async (request, response, parameters) => {
    const rows = Database.queryAsync(`SELECT * FROM users WHERE email = ${Database.connection.escape(parameters.email)} LIMIT 1`);

    if(rows.length != 0)
        return { success: false, content: "E-mail address already belongs to an user!" };

    const id = uuidv4();
    const token = uuidv4();
    const hash = await bcrypt.hash(parameters.password, 10);

    const escape = {
        id: Database.connection.escape(id),
        email: Database.connection.escape(parameters.email),
        firstname: Database.connection.escape(parameters.firstname),
        lastname: Database.connection.escape(parameters.lastname),
        password: Database.connection.escape(hash),
        
        token: Database.connection.escape(token)
    };

    await Database.queryAsync(`INSERT INTO users (id, email, password, firstname, lastname) VALUES (${escape.id}, ${escape.email}, ${escape.password}, ${escape.firstname}, ${escape.lastname})`);

    await Database.queryAsync(`INSERT INTO user_tokens (id, user) VALUES (${escape.token}, ${escape.id})`);

    return { success: true, content: token };
}, [ "firstname", "lastname", "email", "password" ]);
