import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { useThemeConfig } from "../../../../utils/themes";
import FormInput from "../../../../components/formInput";
import { FontAwesome, Feather } from '@expo/vector-icons'; 
import Button from "../../../../components/button";
import Bike from "../../../../components/bike";
import { getBikes } from "../../../../models/bike";

export default function FinishRecordingPage() {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();

    const [ submitting, setSubmitting ] = useState(false);

    const [ bikes, setBikes ] = useState(null);
    const [ selectedBike, setSelectedBike ] = useState(null);

    useEffect(() => {
        getBikes(userData.key).then((bikes) => setBikes(bikes));
    }, []);
    
    return (
        <View style={{ flex: 1, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Finish your activity" }} />

            <ScrollView style={{ padding: 10 }}>
                <View style={{ gap: 10 }}>
                    <Text style={{ color: themeConfig.color, fontSize: 40, fontWeight: "500", textAlign: "center" }}>
                        Great job, Nora!
                    </Text>

                    <Text style={{ color: themeConfig.color, fontSize: 18 }}>
                        You reached 28.3 km at an average of 32.7 km/h, at which you topped off at 45.2 km/h!
                    </Text>

                    <View>
                        <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                            <FormInput placeholder="A short summary (optional)" icon={(<FontAwesome name="bicycle" size={24} color={themeConfig.color}/>)} props={{
                                autoCapitalize: "sentences",
                                autoCorrect: true,
                                enterKeyHint: "next",
                                inputMode: "text",
                                //onSubmitEditing: () => passwordRef.current.focus(),
                                //onChangeText: (text) => setEmail(text)
                            }}/>
                        </SafeAreaView>
                        
                        <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                            <FormInput placeholder="A longer summary (optional)" icon={(<FontAwesome name="comments" size={24} color={themeConfig.color}/>)} props={{
                                autoCapitalize: "sentences",
                                autoCorrect: true,
                                inputMode: "text",
                                multiline: true,
                                //onSubmitEditing: () => passwordRef.current.focus(),
                                //onChangeText: (text) => setEmail(text)
                            }}
                            style={{
                                textAlignVertical: "top",
                                height: 100
                            }}/>
                        </SafeAreaView>
                    </View>

                    {(!selectedBike)?(
                        <ScrollView horizontal={true}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                {(bikes)?(
                                    <>
                                        {(bikes.map((bike) => (
                                            <TouchableOpacity key={bike.id} style={{
                                                position: "relative",

                                                height: 80,
                                                width: 140,

                                                backgroundColor: themeConfig.placeholder,
                                                borderRadius: 6,

                                                overflow: "hidden"
                                            }} onPress={() => setSelectedBike((selectedBike?.id === bike.id)?(null):(bike))}>
                                                <Image source={{
                                                    uri: bike.image  
                                                }} style={{
                                                    height: 80,
                                                    width: "100%"
                                                }}/>

                                                <View style={{
                                                    position: "absolute",

                                                    left: 0,
                                                    top: 0,

                                                    width: "100%",
                                                    height: "100%",

                                                    backgroundColor: (selectedBike === bike.id)?("transparent"):("rgba(0, 0, 0, .5)"),
                                                    borderWidth: (selectedBike === bike.id)?(1):(0),
                                                    borderColor: themeConfig.color,

                                                    borderRadius: 6,

                                                    justifyContent: "flex-end",

                                                    padding: 5
                                                }}>
                                                    <Text style={{ color: themeConfig.color, fontSize: 18, fontStyle: "italic" }}>"{bike.name}"</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )))}

                                        <TouchableOpacity style={{
                                            height: 80,
                                            width: 140,

                                            borderRadius: 6,
                                            borderColor: themeConfig.border,

                                            overflow: "hidden",

                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2
                                        }} onPress={() => router.push("/bike/create")}>
                                            <View style={{ position: "relative" }}>
                                                <FontAwesome name="bicycle" size={32} color={themeConfig.color}/>
                                                <FontAwesome name="plus" size={20} color={themeConfig.color} style={{ 
                                                    position: "absolute",

                                                    right: -10,
                                                    top: -5
                                                }}/>
                                            </View>

                                            <Text style={{ color: themeConfig.color }}>Add a bike</Text>
                                        </TouchableOpacity>
                                    </>
                                ):(
                                    Array(4).fill(null).map((_, index) => (
                                        <View key={index} style={{
                                            position: "relative",

                                            height: 80,
                                            width: 140,

                                            backgroundColor: themeConfig.placeholder,
                                            borderRadius: 6,

                                            overflow: "hidden"
                                        }}/>
                                    ))
                                )}
                            </View>
                        </ScrollView>
                    ):(
                        <Bike data={selectedBike} buttons={(
                            <TouchableOpacity onPress={() => setSelectedBike(null)}>
                                <Feather name="repeat" size={24} color={themeConfig.color}/>
                            </TouchableOpacity>
                        )}/>
                    )}

                    <View style={{ marginTop: 20, gap: 10 }}>
                        <Button primary={true} label="Publish activity"/>

                        <Button primary={false} label="Save as draft"/>

                        <Button primary={false} type="danger" label="Discard"/>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
