module.exports = class UserResponse {
    constructor(data) {
        this.id = data.id;
        this.slug = data.slug;
        this.name = data.firstname + " " + data.lastname;
    };
};
