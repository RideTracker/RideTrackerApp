import Config from "app/Data/Config";
import Cache from "app/Data/Cache";
import API from "app/Services/API";

export default class User {
    static guest = true;

    static async authenticateAsync() {
        if(!Config.user?.token)
            return false;

        const result = await API.post("/api/v1/user/authenticate", { token: Config.user.token });

        if(!result.success) {
            Config.user.token = null;
            Config.saveAsync();

            return false;
        }

        Config.user.token = result.content.token;
        Config.saveAsync();

        this.guest = false;
        this.id = result.content.id;
        await this.update();

        return true;
    };

    static async update() {
        this.data = await Cache.getUser(this.id, true);
    };

    static async logout() {
        Config.user.token = null;
        Config.saveAsync();

        this.guest = true;
        this.id = null;

        this.data = null;

        await API.post("/api/v1/user/logout", { token: Config.user.token });
    };
};
