import Config from "./Config";
import API from "./../API";

export default class User {
    static guest = true;

    static async authenticateAsync() {
        if(!Config.user?.token)
            return false;

        const result = await API.post("/api/user/authenticate", { token: Config.user.token });

        if(!result.success)
            return false;

        Config.user.token = result.content.token;
        Config.saveAsync();

        this.guest = false;
        this.id = result.content.id;

        return true;
    };
};
