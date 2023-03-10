import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
import { Stack } from "expo-router";
import { useThemeConfig } from "../../../../utils/themes";
import Button from "../../../../components/button";
import { setUserData } from "../../../../utils/stores/userData";

export default function Settings() {
    const dispatch = useDispatch();

    const themeConfig = useThemeConfig();
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Settings" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView>
                    <Button primary={true} label="Dark mode" onPress={() => dispatch(setUserData({ theme: "dark"}))}/>
                    <Button primary={true} label="Light mode" onPress={() => dispatch(setUserData({ theme: "light"}))}/>
                </ScrollView>
            </View>
        </View>
    );
};
