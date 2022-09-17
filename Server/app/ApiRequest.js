module.exports = class ApiRequest {
    constructor(request) {
        this.request = request;
    };

    getParameters() {
        const indexOfQuery = this.request.url.indexOf('?');

        if(indexOfQuery == -1)
            return {};

        let parameters = this.request.url.substr(indexOfQuery + 1, this.request.url.length);

        parameters = parameters.split('&');

        let result = {};

        for(let index = 0; index < parameters.length; index++) {
            const pair = parameters[index].split('=');

            result[pair[0]] = pair[1];
        }

        return result;
    };

    static type = "text/json";
};
