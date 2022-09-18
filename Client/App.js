import { StyleSheet, View, Platform } from "react-native";
import * as Location from "expo-location";

import Pages from "./app/Layouts/Pages.component";

import Config from "./app/config.json";
import API from "./app/API";
import Files from "./app/Data/Files";

export default function App() {
    //await API.ping(true);

    //await Files.uploadFiles();
    
    Location.requestForegroundPermissionsAsync().then(() => {
        Location.requestBackgroundPermissionsAsync();
    });

    const styles = StyleSheet.create({
        document: {
            backgroundColor: Config.colorPalette.background,

            minHeight: "100%"
        }
    });

	return (
        <View style={styles.document}>
            <Pages/>
        </View>
	);
}
