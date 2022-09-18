const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const global = require("../../../../global");

const ApiRequest = require("../../ApiRequest");
const ApiResponse = require("../../ApiResponse");

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
module.exports = class ActivityUploadRequest extends ApiRequest {
    static path = "/api/activity/upload";
    
    async respond() {
        return new Promise((resolve, reject) => {
            let body = "";

            this.request.on("data", (chunck) => {
                body += chunck;
            });

            this.request.on("end", async () => {
                const id = uuidv4();

                global.connection.query(`INSERT INTO activities (id, user, timestamp) VALUES (${global.connection.escape(id)}, ${global.connection.escape(1)}, ${global.connection.escape(Date.now())})`);
                fs.writeFileSync("./app/public/rides/" + id + ".json", body);

                resolve(new ApiResponse(true, null))
            });
        });
    };
};
