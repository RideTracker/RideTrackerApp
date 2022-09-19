import { Alert } from "react-native";

import * as FileSystem from "expo-file-system";

import API from "../API";

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

	static async uploadFiles() {
		const directory = "rides";
		
		const directoryInfo = await FileSystem.getInfoAsync(this.directory + "/" + directory + "/");

		if(!directoryInfo.exists) {
			console.error("no directory");
			return;
		}

		const files = await FileSystem.readDirectoryAsync(this.directory + "/" + directory + "/");

		for(let index = 0; index < files.length; index++) {
			console.log(files[index]);

			await (new Promise(async (resolve) => {
				const info = await FileSystem.getInfoAsync(this.directory + "/" + directory + "/" + files[index]);

				Alert.alert("Do you want to upload this file (" + info.size + " kB)?", (new Date(info.modificationTime * 1000).toLocaleString()), [
					{
						text: "Delete",
						style: "cancel",
						
						onPress: async () => {
							await FileSystem.deleteAsync(this.directory + "/" + directory + "/" + files[index]);

							resolve();
						}
					},

					{
						text: "Yes",

						onPress: async () => {
							const content = await FileSystem.readAsStringAsync(this.directory + "/" + directory + "/" + files[index]);

							await API.put("/api/activity/upload", content);

							resolve();
						}
					},
					
					{
						text: "Cancel",
						style: "cancel",
						
						onPress: () => {
							resolve();
						}
					}
				]);
			}));
		}
	}
};
