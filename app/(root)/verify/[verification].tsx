import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter, Stack, Link, useSearchParams } from "expo-router";
import { PingResponse, ping } from "../../../models/ping";
import { useAuth } from "../../../utils/auth/provider";
import { useThemeConfig } from "../../../utils/themes";
import Button from "../../../components/button";
import { FontAwesome } from '@expo/vector-icons'; 
import FormInput from "../../../components/formInput";
import { registerUser, verifyUser } from "../../../models/user";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../utils/stores/userData";

export default function Verify() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();
    const dispatch = useDispatch();
    const { verification } = useSearchParams();

    const [ submitting, setSubmitting ] = useState(false);

    const [ code, setCode ] = useState("");

    const codeRef = useRef(null);
    
    useEffect(() => {
        if(submitting) {
            verifyUser(verification as string, code).then((response) => {
                if(!response.success) {
                    Alert.alert("An error occurred!", response.message, [
                        {
                            onPress(value) {
                                setSubmitting(false);
                            }
                        }
                    ]);

                    return;
                }

                dispatch(setUserData({ key: response.key }));

                router.push("/");
            });
        }
    }, [ submitting ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10, backgroundColor: themeConfig.background }}>
            <ScrollView style={{ paddingTop: 10 }}>
                <View style={{ gap: 20, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                    <SafeAreaView style={{ gap: 10 }}>
                        <Text style={{ color: themeConfig.color, fontSize: 20, fontWeight: "500" }}>Email address</Text>
                        <Text style={{ color: themeConfig.color, fontSize: 16 }}>You will not receive any spam email, we just need to verify your email for spam anti-measures.</Text>

                        <FormInput inputRef={codeRef} placeholder="Verification code" icon={(<FontAwesome name="envelope" size={24} color={themeConfig.color}/>)} props={{
                            onChangeText: (text) => setCode(text),
                            autoCorrect: false,
                            enterKeyHint: "send",
                            inputMode: "numeric",
                            keyboardType: "numeric",
                            onSubmitEditing: () => setSubmitting(true)
                        }}/>
                    </SafeAreaView>

                    <Button primary={false} label={!submitting && "Verify"} onPress={() => setSubmitting(true)}>
                        {(submitting) && (
                            <ActivityIndicator size={24}/>
                        )}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};