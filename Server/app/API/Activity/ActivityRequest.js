const global = require("../../../global");

const ApiRequest = require("../ApiRequest");
const ApiResponse = require("../ApiResponse");

const ActivityResponse = require("./ActivityResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class ActivityRequest extends ApiRequest {
    static path = "/api/activity";
    
    async respond() {
        return new Promise((resolve, reject) => {
            const parameters = this.getParameters();

            global.connection.query(`SELECT * FROM activities WHERE id = ${global.connection.escape(parameters.id)} LIMIT 1`, (error, rows) => {
                if(error)
                    return reject(new ApiResponse(false, error));

                if(rows.length == 0)
                    return reject(new ApiResponse(false, "No results."));
    
                return resolve(new ApiResponse(true, new ActivityResponse(rows[0])));
            });
        });
    };
};
