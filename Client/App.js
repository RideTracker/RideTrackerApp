import { StyleSheet, View, Platform, Appearance } from "react-native";
import * as Location from "expo-location";

import Page from "./app/Layouts/Page.component";

import Config from "./app/config.json";
import API from "./app/API";
import Files from "./app/Data/Files";

const config = Config[(Appearance.getColorScheme() == "dark")?("dark"):("default")];

export default function App() {
    //await API.ping(true);
    
    Location.requestForegroundPermissionsAsync().then(() => {
        Location.requestBackgroundPermissionsAsync();
    });

    const styles = StyleSheet.create({
        document: {
            backgroundColor: config.colorPalette.background,

            minHeight: "100%"
        }
    });

	return (
        <View style={styles.document}>
            <Page/>
        </View>
	);
}
