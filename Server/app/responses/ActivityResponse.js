module.exports = class ActivityResponse {
    constructor(data) {
        this.id = data.id;
        this.user = data.user;
        this.timestamp = data.timestamp;
    };
};
