import { Stack, useRouter } from "expo-router";
import { View, TouchableWithoutFeedback } from "react-native";
import { CaptionText } from "./texts/Caption";
import { useTheme } from "../utils/themes";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModalPage from "./ModalPage";

type DropdownPageProps = {
    items: {
        text: string;
        icon: ReactNode;
        disabled?: boolean;
        type?: "danger";

        onPress: () => void;
    }[];
};

export default function DropdownPage({ items }: DropdownPageProps) {
    const router = useRouter();
    const theme = useTheme();
    
    return (
        <ModalPage>
            <View style={{
                gap: 10,
                
                padding: 10,
                paddingBottom: 0
            }}>
                {items.map((item) => (
                    <TouchableOpacity key={item.text} disabled={item.disabled} onPress={() => item.onPress()} style={{
                        gap: 10,

                        flexDirection: "row",
                        opacity: (item.disabled)?(0.5):(1),

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

                        <CaptionText style={{
                            paddingRight: 40,
                            color: (item.type === "danger")?(theme.red):(theme.color)    
                        }}>{item.text}</CaptionText>
                    </TouchableOpacity>
                ))}
            </View>
        </ModalPage>
    );
};
