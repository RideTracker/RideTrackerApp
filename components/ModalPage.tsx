import { Stack, useRouter } from "expo-router";
import { View, TouchableWithoutFeedback, ScrollView } from "react-native";
import { useTheme } from "../utils/themes";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";

type ModalPageProps = {
    midlays?: ReactNode;
    children: ReactNode;
};

export default function ModalPage({ midlays, children }: ModalPageProps) {
    const router = useRouter();
    const theme = useTheme();
    
    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <Stack.Screen options={{ title: "Dropdown" }}/>

            <TouchableWithoutFeedback style={{
                flex: 1
            }} onPress={() => router.back()}>
                <View style={{
                    flex: 1,

                    backgroundColor: "rgba(0, 0, 0, .25)"
                }}/>
            </TouchableWithoutFeedback>

            {midlays}
        
            <View style={{
                height: "auto",
                marginTop: "auto",

                backgroundColor: "rgba(0, 0, 0, .25)"
            }}>
                <ScrollView style={{
                    backgroundColor: theme.background,
                    
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
                    <SafeAreaView edges={[ "bottom" ]}>
                        {children}
                    </SafeAreaView>
                </ScrollView>
            </View>
        </View>
    );
};
