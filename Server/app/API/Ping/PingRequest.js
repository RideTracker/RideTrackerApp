const ApiRequest = require("../ApiRequest");
const ApiResponse = require("../ApiResponse");

module.exports = class PingRequest extends ApiRequest {
    static path = "/api/ping";
    
    async respond() {
        return new ApiResponse(true, "pong");
    };
};
