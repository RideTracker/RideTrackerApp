import { Stack, useRouter } from "expo-router";
import { View, TouchableWithoutFeedback } from "react-native";
import { CaptionText } from "./texts/Caption";
import { useTheme } from "../utils/themes";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

type DropdownPageProps = {
    items: {
        text: string;
        icon: ReactNode;

        onPress: () => void;
    }[];
};

export default function DropdownPage({ items }: DropdownPageProps) {
    const router = useRouter();
    const theme = useTheme();
    
    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <Stack.Screen options={{
                title: "Dropdown",

                presentation: "transparentModal",
                headerShown: false
            }}/>

            <TouchableWithoutFeedback style={{
                flex: 1
            }} onPress={() => router.back()}>
                <View style={{ flex: 1 }}/>
            </TouchableWithoutFeedback>
        
            <SafeAreaView edges={[ "bottom" ]}>
                <View style={{
                    height: "auto",
                    marginTop: "auto",

                    backgroundColor: theme.background,
                    padding: 10,
                    paddingBottom: 0,

                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,

                    gap: 10
                }}>
                    {items.map((item) => (
                        <TouchableOpacity key={item.text} onPress={() => item.onPress()} style={{
                            gap: 10,

                            flexDirection: "row",

                            alignItems: "center"
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,

                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {item.icon}
                            </View>

                            <CaptionText style={{ paddingRight: 40 }}>{item.text}</CaptionText>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>
        </View>
    );
};
