import Config from "app/Data/Config";
import API from "app/Services/API";

export default class User {
    static guest = true;

    static async authenticateAsync() {
        if(!Config.user?.token)
            return false;

        const result = await API.post("/api/user/authenticate", { token: Config.user.token });

        if(!result.success) {
            Config.user.token = null;
            Config.saveAsync();

            return false;
        }

        Config.user.token = result.content.token;
        Config.saveAsync();

        this.guest = false;
        this.id = result.content.id;

        return true;
    };

    static async logout() {
        Config.user.token = null;
        Config.saveAsync();

        this.guest = true;
        this.id = null;

        await API.post("/api/user/logout", { token: Config.user.token });
    };
};
