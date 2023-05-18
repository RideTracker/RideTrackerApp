import { ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import Button from "../../../../components/Button";
import { setUserData } from "../../../../utils/stores/userData";

export default function Settings() {
    const dispatch = useDispatch();

    const theme = useTheme();

    const router = useRouter();
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Settings" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView style={{ padding: 10 }}>
                    <View style={{ gap: 10 }}>
                        <Button primary={false} label="Avatar editor" onPress={() => router.push("/avatar-editor/")}/>

                        <Button primary={true} label="Dark mode" onPress={() => dispatch(setUserData({ theme: "dark"}))}/>
                        <Button primary={true} label="Light mode" onPress={() => dispatch(setUserData({ theme: "light"}))}/>

                        <Button primary={false} label="Reset key" onPress={() => dispatch(setUserData({ key: null }))}/>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};
