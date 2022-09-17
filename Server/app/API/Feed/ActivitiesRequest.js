const global = require("../../../global");

const ApiRequest = require("../ApiRequest");
const ApiResponse = require("../ApiResponse");

const ActivityResponse = require("../Activity/ActivityResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class ActiviesRequest extends ApiRequest {
    static path = "/feed/activities";
    
    async respond() {
        return new Promise((resolve, reject) => {
            global.connection.query("SELECT id FROM activities", (error, rows) => {
                if(error)
                    reject(new ApiResponse(false, error));
    
                const activities = [];
    
                for(let row = 0; row < rows.length; row++)
                    activities.push(rows[row].id);
    
                resolve(new ApiResponse(true, activities));
            });
        });
    };
};
