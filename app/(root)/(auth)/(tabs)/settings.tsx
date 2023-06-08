import { Platform, ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import Button from "../../../../components/Button";
import { setUserData } from "../../../../utils/stores/userData";
import { setClient } from "../../../../utils/stores/client";
import { SelectList } from "../../../../components/SelectList";
import { useUser } from "../../../../modules/user/useUser";
import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";

export default function Settings() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const router = useRouter();
    const userData = useUser();
    
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

                        {(Platform.OS === "ios") && (
                            <SelectList placeholder="Select map provider..." initialValue={userData.mapProvider} items={[
                                {
                                    key: "default",
                                    text: "Operating system default"
                                },

                                {
                                    key: PROVIDER_GOOGLE,
                                    text: "Google Maps Platform"
                                }
                            ]} onChange={(value) => dispatch(setUserData({ mapProvider: (value !== "default")?(value):(PROVIDER_DEFAULT) }))}/>
                        )}

                        <Button primary={false} label="Reset key" onPress={() => {
                            dispatch(setUserData({ key: null }));
                            dispatch(setClient(null));
                        }}/>

                        <Button primary={false} label="Reset data" onPress={() => {
                            dispatch(setUserData({ key: undefined, filters: undefined, user: undefined }));
                            dispatch(setClient(null));
                        }}/>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
