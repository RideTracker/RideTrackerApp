const { v4: uuidv4 } = require("uuid");

const global = require("../../../../global");

const ApiRequest = require("../../ApiRequest");
const ApiResponse = require("../../ApiResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class UserAuthenticateRequest extends ApiRequest {
    static path = "/api/user/authenticate";
   
    requiredProperties = [ "token" ];

    async respond() {
        return new Promise(async (resolve, reject) => {
            const token = await this.getBodyAsync();

            global.connection.query(`SELECT * FROM user_tokens WHERE id = ${global.connection.escape(token)} LIMIT 1`, (error, rows) => {
                if(error)
                    return reject(new ApiResponse(false, error));

                if(rows.length == 0)
                    return reject(new ApiResponse(false, "Authentication failed."));

                const user = rows[0].user;

                global.connection.query(`DELETE FROM user_tokens WHERE id = ${global.connection.escape(token)}`);

                const newToken = uuidv4();

                global.connection.query(`INSERT INTO user_tokens (id, user) VALUES (${global.connection.escape(newToken)}, ${global.connection.escape(user)})`);

                return resolve(new ApiResponse(true, {
                    id: user,
                    token: newToken
                }));
            });
        });
    };
};
