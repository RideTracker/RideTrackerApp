import { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { useTheme } from "../../../utils/themes";
import Button from "../../../components/Button";
import { FontAwesome } from "@expo/vector-icons"; 
import FormInput from "../../../components/FormInput";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../utils/stores/userData";
import { useClient } from "../../../modules/useClient";
import { createClient, verifyLogin } from "@ridetracker/ridetrackerclient";
import { useUser } from "../../../modules/user/useUser";
import { setClient } from "../../../utils/stores/client";
import Constants from "expo-constants";

export default function Verify() {
    const client = useClient();
    const theme = useTheme();
    const userData = useUser();
    const router = useRouter();
    const dispatch = useDispatch();
    const { verification } = useSearchParams();

    const [ submitting, setSubmitting ] = useState(false);

    const [ code, setCode ] = useState("");

    const codeRef = useRef(null);
    
    useEffect(() => {
        if(submitting) {
            verifyLogin(client, verification as string, code).then((response) => {
                if(!response.success) {
                    Alert.alert("An error occurred!", response.message, [
                        {
                            onPress() {
                                setSubmitting(false);
                            }
                        }
                    ]);

                    return;
                }

                dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                    email: userData.email,
                    key: response.token.key
                })));

                dispatch(setUserData({
                    token: response.token
                }));

                router.push("/");
            });
        }
    }, [ submitting ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10, backgroundColor: theme.background }}>
            <ScrollView style={{ paddingTop: 10 }}>
                <View style={{ gap: 20, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                    <SafeAreaView style={{ gap: 10 }}>
                        <Text style={{ color: theme.color, fontSize: 20, fontWeight: "500" }}>Email address</Text>
                        <Text style={{ color: theme.color, fontSize: 16 }}>You will not receive any spam email, we just need to verify your email for spam anti-measures.</Text>

                        <FormInput inputRef={codeRef} placeholder="Verification code" icon={(<FontAwesome name="envelope" size={24} color={theme.color}/>)} props={{
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
}
