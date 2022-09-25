const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const global = require("../../../../global");

const ApiRequest = require("../../ApiRequest");
const ApiResponse = require("../../ApiResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class UserLoginRequest extends ApiRequest {
    static path = "/api/user/login";
   
    requiredProperties = [ "email", "password" ];

    async respond() {
        return new Promise(async (resolve, reject) => {
            const parameters = JSON.parse(await this.getBodyAsync());

            for(let index = 0; index < this.requiredProperties.length; index++)
                if(!parameters.hasOwnProperty(this.requiredProperties[index]))
                    return reject(new ApiResponse(false, "Missing property name " + this.requiredProperties[index] + "!"));

            global.connection.query(`SELECT * FROM users WHERE email = ${global.connection.escape(parameters.email)} LIMIT 1`, (error, rows) => {
                if(error)
                    return reject(new ApiResponse(false, error));

                if(rows.length == 0)
                    return reject(new ApiResponse(false, "Email isn't registered to any users."));

                bcrypt.compare(parameters.password, rows[0].password, (error, match) => {
                    if(!match)
                        return reject(new ApiResponse(false, "Your credentials does not match!"));

                    const token = uuidv4();

                    global.connection.query(`INSERT INTO user_tokens (id, user) VALUES (${global.connection.escape(token)}, ${global.connection.escape(rows[0].id)})`, (error, rows) => {
                        if(error)
                            return reject(new ApiResponse(false, error));

                        return resolve(new ApiResponse(true, token));
                    });
                });
            });
        });
    };
};
