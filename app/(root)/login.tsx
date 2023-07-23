import { Stack, useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { View, Image, TextInput, ActivityIndicator, Text, Alert, KeyboardAvoidingView, LayoutRectangle } from "react-native";
import { useTheme } from "../../utils/themes";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from "../../components/FormInput";
import { FontAwesome } from "@expo/vector-icons";
import Button from "../../components/Button";
import { Link } from "expo-router";
import { getRandomToken, createRideTrackerClient, authenticateUser, loginUser } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import { setClient } from "../../utils/stores/client";
import { setUserData } from "../../utils/stores/userData";
import { useClient } from "../../modules/useClient";
import { useDispatch } from "react-redux";

const logo = require("../../assets/logos/logo-motto.png");
const background = require("../../assets/extras/wallpapers/login.jpg");

export default function LoginPage() {
    const theme = useTheme();
    const client = useClient();
    const router = useRouter();
    const dispatch = useDispatch();

    const passwordRef = useRef<TextInput>(null);

    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ layout, setLayout ] = useState<LayoutRectangle>(null);

    useEffect(() => {
        if(submitting) {
            loginUser(client, email, password).then((response) => {
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

                if(response.token) {
                    dispatch(setClient(createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                        identity: email,
                        key: response.token.key,
                        type: "Basic"
                    })));
    
                    dispatch(setUserData({
                        email,
                        token: response.token,
                        user: response.user
                    }));
    
                    //router.push("/feed");
                }
                else if(response.verification) {
                    dispatch(setUserData({
                        email
                    }));

                    router.push(`/verify/${response.verification}`);
                }
                //dispatch(setUserData({ key: response.key }));
            });
        }
    }, [ submitting ]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "",
                headerShown: true,
                headerTransparent: true,

                headerStyle: {
                    backgroundColor: "transparent"
                },

                headerTintColor: theme.color,
                headerTitleStyle: {
                    color: theme.color
                }
            }} />

            <View style={{
                height: "40%",

                backgroundColor: theme.background,

                position: "relative"
            }} onLayout={(event) => setLayout(event.nativeEvent.layout)}>
                <Image style={{
                    position: "absolute",
                    left: 0,
                    top: 0,

                    height: "100%",
                    width: "100%",

                    opacity: .5,

                    resizeMode: "cover"
                }} source={background} fadeDuration={1000} defaultSource={background}/>

                <LinearGradient colors={[ "transparent", theme.background ]} locations={[ 0.2, 1 ]} style={{ 
                    position: "absolute",

                    left: 0,
                    top: 0,

                    height: "100%",
                    width: "100%"
                }}/>
            </View>

            <View style={{
                flex: 1,

                gap: 10,

                padding: 10
            }}>
                <KeyboardAvoidingView contentContainerStyle={{ opacity: (submitting)?(0.5):(1.0) }} behavior="padding" keyboardVerticalOffset={layout?.height} pointerEvents={(submitting)?("none"):("auto")}>
                    <View style={{ marginTop: -100 }}>
                        <Image source={logo} style={{ height: 100, width: "100%", resizeMode: "contain" }}/>
                    </View>

                    <View style={{ backgroundColor: theme.background, marginVertical: 10, gap: 10 }}>
                        <FormInput placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={theme.color}/>)} props={{
                            autoCapitalize: "none",
                            autoComplete: "email",
                            autoCorrect: false,
                            enterKeyHint: "next",
                            inputMode: "email",
                            keyboardType: "email-address",
                            onSubmitEditing: () => passwordRef.current.focus(),
                            onChangeText: (text) => setEmail(text)
                        }}/>

                        <FormInput inputRef={passwordRef} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={theme.color}/>)} props={{
                            autoCapitalize: "none",
                            autoComplete: "password",
                            autoCorrect: false,
                            enterKeyHint: "send",
                            secureTextEntry: true,
                            onSubmitEditing: () => setSubmitting(true),
                            onChangeText: (text) => setPassword(text)
                        }}/>

                        <Button primary={true} label={!submitting && "Sign in"} onPress={() => setSubmitting(true)}>
                            {(submitting) && (<ActivityIndicator size={24} color={theme.contrast}/>)}
                        </Button>
                    </View>
                </KeyboardAvoidingView>

                <Text style={{
                    textAlign: "center",
                    color: theme.color
                }}>Forgot your credentials? <Link href="/forgotten" style={{ color: theme.brand, fontWeight: "500" }}>Click here to recover</Link></Text>

                {(Constants.expoConfig.extra.environment !== "production") && (
                    <View style={{ marginTop: "auto" }}>
                        <Button primary={false} label="Assume random user" onPress={async () => {
                            const randomUser = await getRandomToken(client);

                            const randomUserClient = createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                                identity: randomUser.email,
                                key: randomUser.token.key,
                                type: "Basic"
                            });

                            const authentication = await authenticateUser(randomUserClient);

                            if(authentication.success) {
                                dispatch(setClient(createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                                    identity: randomUser.email,
                                    key: authentication.token.key,
                                    type: "Basic"
                                })));

                                dispatch(setUserData({
                                    email: randomUser.email,
                                    token: authentication.token,
                                    user: authentication.user
                                }));
                            }
                        }}/>
                    </View>
                )}
            </View>
        </View>
    );
};
