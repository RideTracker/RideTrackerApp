import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import LandingPage from "./app/pages/LandingPage";

export default function App() {
    const styles = StyleSheet.create({
        document: {
            backgroundColor: "#1E1E1E",

            minHeight: "100%",

            paddingTop: Constants.statusBarHeight,

            flex: 1
        },

        header: {
            width: "100%",

            backgroundColor: "#1E1E1E",

            feed: {
                color: "#FFF",

                fontWeight: "bold",
                fontSize: 26,

                padding: 12,

                textAlign: "center"
            }
        },

        footer: {
            height: 70,
            width: "100%",

            backgroundColor: "#1E1E1E",

            container: {
                flex: 1,
                flexDirection: "row",

                button: {
                    height: 60,

                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",

                    icon: {
                        color: "#F1F1F1",
            
                        fontSize: 20,            
                    },

                    text: {
                        color: "#FFF",

                        marginTop: 4,
            
                        fontSize: 14,
            
                        textAlign: "center"
                    }
                }
            }
        }
    });

	return (
        <View style={styles.document}>
            <View style={styles.header}>
                <Text style={styles.header.feed}>Home</Text>
            </View>

            <LandingPage/>

            <View style={styles.footer}>
                <View style={styles.footer.container}>
                    <TouchableOpacity style={styles.footer.container.button}>
                        <FontAwesome5 style={styles.footer.container.button.icon} name={"home"}/>

                        <Text style={styles.footer.container.button.text}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.footer.container.button}>
                        <FontAwesome5 style={styles.footer.container.button.icon} name={"circle"} solid/>

                        <Text style={styles.footer.container.button.text}>Record</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.footer.container.button}>
                        <FontAwesome5 style={styles.footer.container.button.icon} name={"user"} solid/>

                        <Text style={styles.footer.container.button.text}>Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
	);
}
