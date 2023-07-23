import { Stack, useRouter } from "expo-router";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, Image, TextInput, ActivityIndicator, Text, Alert, KeyboardAvoidingView, LayoutRectangle, ScrollView, Dimensions, Animated, Easing } from "react-native";
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
import { ParagraphText } from "../../components/texts/Paragraph";
import { CaptionText } from "../../components/texts/Caption";
import { SmallText } from "../../components/texts/Small";

const logo = require("../../assets/logos/logo-motto.png");
const background = require("../../assets/extras/wallpapers/login.jpg");

export enum RegisterPageSteps {
    Name,
    Email,
    Password
};

export default function Register2Page() {
    const theme = useTheme();
    const client = useClient();
    const router = useRouter();
    const dispatch = useDispatch();

    const scrollViewRef = useRef<ScrollView>();

    const [ step, setStep ] = useState<RegisterPageSteps>(RegisterPageSteps.Name);

    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);


    const [ firstname, setFirstname ] = useState<string>("");
    const [ lastname, setLastname ] = useState<string>("");
    const [ nameLayout, setNameLayout ] = useState<LayoutRectangle>(null);

    const [ email, setEmail ] = useState<string>("");
    const [ emailLayout, setEmailLayout ] = useState<LayoutRectangle>(null);

    const [ password, setPassword ] = useState<string>("");
    const [ passwordLayout, setPasswordLayout ] = useState<LayoutRectangle>(null);

    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ layout, setLayout ] = useState<LayoutRectangle>(null);

    const [ left, setLeft ] = useState<Animated.Value>(new Animated.Value(0));

    useEffect(() => {
        const dimensions = Dimensions.get("screen");

        Animated.spring(left, {
            toValue: -(dimensions.width * step),
            useNativeDriver: false,
            speed: 6
        }).start();
    }, [ step ]);

    const handleStep = useCallback(() => {
        setStep(step + 1);
    }, [ step ]);

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

                gap: 10
            }}>
                <KeyboardAvoidingView contentContainerStyle={{ opacity: (submitting)?(0.5):(1.0) }} behavior="padding" keyboardVerticalOffset={layout?.height} pointerEvents={(submitting)?("none"):("auto")}>
                    <View style={{ marginTop: -50 }}>
                        <Image source={logo} style={{ height: 100, width: "100%", resizeMode: "contain" }}/>
                    </View>
                    
                    <Animated.View style={{
                        flexWrap: "nowrap",
                        flexDirection: "row",

                        width: "100%",

                        left,

                        padding: 10,
                        gap: 20,

                        position: "relative"
                    }}>
                        <View style={{ width: "100%", gap: 10 }}>
                            <CaptionText>Enter your full name</CaptionText>
                            <ParagraphText>We aim to be a social platform for real-life involvement and believe best practice is to use real names.</ParagraphText>

                            <View style={{
                                flexDirection: "row",
                                gap: 10
                            }}>
                                <View style={{ width: "50%" }}>
                                    <FormInput inputRef={firstnameRef} placeholder="Firstname" icon={(<FontAwesome name="user" size={24} color={theme.color}/>)} props={{
                                        autoCapitalize: "words",
                                        onChangeText: (text) => setFirstname(text),
                                        autoComplete: "name-given",
                                        autoCorrect: true,
                                        enterKeyHint: "next",
                                        onSubmitEditing: () => lastnameRef.current.focus()
                                    }}/>
                                </View>

                                <View style={{ flexGrow: 1 }}>
                                    <FormInput inputRef={lastnameRef} placeholder="Lastname" style={{ height: 34 }} props={{
                                        autoCapitalize: "words",
                                        onChangeText: (text) => setLastname(text),
                                        autoComplete: "name-family",
                                        autoCorrect: true,
                                        enterKeyHint: "next",
                                        onSubmitEditing: handleStep
                                    }}/>
                                </View>
                            </View>
                        </View>

                        <View style={{ width: "100%", gap: 10 }}>
                            <CaptionText>Email address</CaptionText>
                            <ParagraphText>Your email will only be used for verification cases.</ParagraphText>
                        
                            <FormInput inputRef={emailRef} placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={theme.color}/>)} props={{
                                autoCapitalize: "none",
                                onChangeText: (text) => setEmail(text),
                                autoComplete: "email",
                                autoCorrect: false,
                                enterKeyHint: "next",
                                inputMode: "email",
                                keyboardType: "email-address",
                                onSubmitEditing: handleStep
                            }}/>
                        </View>

                        <View style={{ width: "100%", gap: 10 }}>
                            <CaptionText>Password</CaptionText>
                            <ParagraphText>Avoid reusing password, your password must be at least 4 characters long.</ParagraphText>

                            <FormInput inputRef={passwordRef} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={theme.color}/>)} props={{
                                autoCapitalize: "none",
                                autoComplete: "password",
                                autoCorrect: false,
                                enterKeyHint: "send",
                                secureTextEntry: true,
                                onSubmitEditing: () => setSubmitting(true),
                                onChangeText: (text) => setPassword(text)
                            }}/>
                        </View>
                    </Animated.View>
                    
                    <View style={{ padding: 10, gap: 10 }}>
                        <Button primary={true} label={!submitting && "Next step"} onPress={handleStep}>
                            {(submitting) && (<ActivityIndicator size={24} color={theme.contrast}/>)}
                        </Button>

                        <Button primary={false} type="stroke" label="Go back"/>
                    </View>
                </KeyboardAvoidingView>
            </View>

            {/*<View style={{
                flexGrow: 1,

                        

                        <CaptionText>Password</CaptionText>
                        <ParagraphText>Avoid reusing password, your password must be at least 4 characters long.</ParagraphText>

                        <FormInput inputRef={passwordRef} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={theme.color}/>)} props={{
                            autoCapitalize: "none",
                            autoComplete: "password",
                            autoCorrect: false,
                            enterKeyHint: "send",
                            secureTextEntry: true,
                            onSubmitEditing: () => setSubmitting(true),
                            onChangeText: (text) => setPassword(text)
                        }}/>

                        <Button primary={true} label={!submitting && "Register"} onPress={() => setSubmitting(true)}>
                            {(submitting) && (<ActivityIndicator size={24} color={theme.contrast}/>)}
                        </Button>
                    </View>
                </ScrollView>
            </View>*/}
        </View>
    );
};
