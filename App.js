import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import LandingPage from "./app/pages/LandingPage";
import ProfilePage from "./app/pages/ProfilePage";

import Header from "./app/layout/Header";
import Footer from "./app/layout/Footer";

import Pages from "./app/Pages";

import Config from "./app/config.json";

export default function App() {
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
