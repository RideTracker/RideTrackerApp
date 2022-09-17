module.exports = class ApiResponse {
    success = null;
    content = null;

    constructor(success, content) {
        this.success = success;
        this.content = content;
    };
};
