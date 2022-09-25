const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const global = require("../../../../global");

const ApiRequest = require("../../ApiRequest");
const ApiResponse = require("../../ApiResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class UserRegisterRequest extends ApiRequest {
    static path = "/api/user/register";
   
    requiredProperties = [ "firstname", "lastname", "email", "password" ];

    async respond() {
        return new Promise(async (resolve, reject) => {
            const parameters = JSON.parse(await this.getBodyAsync());

            for(let index = 0; index < this.requiredProperties.length; index++)
                if(!parameters.hasOwnProperty(this.requiredProperties[index]))
                    return reject(new ApiResponse(false, "Missing property name " + this.requiredProperties[index] + "!"));

            global.connection.query(`SELECT * FROM users WHERE email = ${global.connection.escape(parameters.email)} LIMIT 1`, (error, rows) => {
                if(error)
                    return reject(new ApiResponse(false, error));

                if(rows.length != 0)
                    return reject(new ApiResponse(false, "Email already belongs to a user!"));

                bcrypt.hash(parameters.password, global.config.password.salt, function(error, hash) {
                    const id = uuidv4();
                    const token = uuidv4();

                    const escape = {
                        id: global.connection.escape(id),
                        email: global.connection.escape(parameters.email),
                        firstname: global.connection.escape(parameters.firstname),
                        lastname: global.connection.escape(parameters.lastname),
                        password: global.connection.escape(hash),
                        
                        token: global.connection.escape(token)
                    };

                    global.connection.query(`INSERT INTO users (id, email, password, firstname, lastname) VALUES (${escape.id}, ${escape.email}, ${escape.password}, ${escape.firstname}, ${escape.lastname})`, (error, rows) => {
                        if(error)
                            return reject(new ApiResponse(false, error));

                        global.connection.query(`INSERT INTO user_tokens (id, user) VALUES (${escape.token}, ${escape.id})`, (error, rows) => {
                            if(error)
                                return reject(new ApiResponse(false, error));
    
                            return resolve(new ApiResponse(true, token));
                        });
                    });
                });
            });
        });
    };
};
