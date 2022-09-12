import * as FileSystem from "expo-file-system";

export default class Files {
    static directory = FileSystem.documentDirectory + "/files/";

    static async createDirectory(directory) {
        const directoryInfo = await FileSystem.getInfoAsync(directory);

        if(!directoryInfo.exists)
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    };

    static async createFile(directory, file, content) {
        await this.createDirectory(this.directory);
        await this.createDirectory(this.directory + "/" + directory);

        await FileSystem.writeAsStringAsync(this.directory + "/" + directory + "/" + file, content);
    };
};
