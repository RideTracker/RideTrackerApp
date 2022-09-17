const global = require("../../../../global");

const ApiRequest = require("../../ApiRequest");
const ApiResponse = require("../../ApiResponse");

const ActivitySummaryResponse = require("./ActivitySummaryResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class ActivitySummaryRequest extends ApiRequest {
    static path = "/activity/summary";
    
    async respond() {
        return new Promise((resolve, reject) => {
            const parameters = this.getParameters();

            global.connection.query(`SELECT * FROM activity_summary WHERE activity = ${global.connection.escape(parameters.id)}`, (error, rows) => {
                if(error)
                    return reject(new ApiResponse(false, error));

                if(rows.length == 0)
                    return reject(new ApiResponse(false, "No results."));

                const result = [];

                for(let index = 0; index < rows.length; index++)
                    result.push(new ActivitySummaryResponse(rows[index]));
    
                return resolve(new ApiResponse(true, result));
            });
        });
    };
};
