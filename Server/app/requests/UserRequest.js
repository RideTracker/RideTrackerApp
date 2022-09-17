const global = require("../../global");

const ApiRequest = require("../ApiRequest");
const ApiResponse = require("../ApiResponse");

const UserResponse = require("../responses/UserResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class UserRequest extends ApiRequest {
    static path = "/user";
    
    async respond() {
        return new Promise((resolve, reject) => {
            const parameters = this.getParameters();

            global.connection.query(`SELECT * FROM users WHERE id = ${global.connection.escape(parameters.id)} LIMIT 1`, (error, rows) => {
                if(error)
                    return reject(new ApiResponse(false, error));

                if(rows.length == 0)
                    return reject(new ApiResponse(false, "No results."));
    
                return resolve(new ApiResponse(true, new UserResponse(rows[0])));
            });
        });
    };
};
