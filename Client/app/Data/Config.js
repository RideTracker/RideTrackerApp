import * as FileSystem from "expo-file-system";

export default class Config {
    static user = {};

    static async createDirectoryAsync() {
        const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "/config/");

        if(info.exists)
            return;

        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "/config/");
    };

    static async readAsync() {
        await this.createDirectoryAsync();
        
        const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "/config/user.json");

        if(!info.exists)
            await this.saveAsync();

        this.user = JSON.parse(await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/config/user.json"));
    };

    static async saveAsync() {
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/config/user.json", JSON.stringify(this.user));
    };
};
