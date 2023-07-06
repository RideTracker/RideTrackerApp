import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import ModalPage from "../../../../components/ModalPage";
import { CaptionText } from "../../../../components/texts/Caption";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import FormInput from "../../../../components/FormInput";
import { useTheme } from "../../../../utils/themes";
import { FontAwesome } from "@expo/vector-icons";
import CategorySelector, { CategorySelectorItem } from "../../../../components/CategorySelector";
import * as ImagePicker from "expo-image-picker";
import Button from "../../../../components/Button";
import { HeaderText } from "../../../../components/texts/Header";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { createBike } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../modules/useClient";
import PageOverlay from "../../../../components/PageOverlay";

type ImageAsset = {
    id: string;
    assetId?: string;
    base64: string;    
};

export default function BikeCreatePage() {
    const theme = useTheme();
    const router = useRouter();
    const client = useClient();

    const [ name, setName ] = useState<string>("");
    const [ model, setModel ] = useState<CategorySelectorItem>(null);
    const [ images, setImages ] = useState<ImageAsset[]>([]);
    const [ uploading, setUploading ] = useState<boolean>(false);

    return (
        <ModalPage>
            <View style={{ paddingVertical: 10, gap: 10 }}>
                <View style={{ paddingHorizontal: 10, gap: 10 }}>
                    <CaptionText>Bike Name</CaptionText>
                    <ParagraphText>For example a nick name, the brand, or the model.</ParagraphText>

                    <FormInput placeholder="Enter a bike name... (optional)" icon={(
                        <FontAwesome name="bicycle" size={24} color={theme.color}/>
                    )} props={{
                        onChangeText: (text) => setName(text)
                    }}/>

                    <CaptionText>Bike Model</CaptionText>
                </View>
                
                <CategorySelector selectedItem={model} items={[
                    {
                        type: "road_bike",
                        name: "Road Bike",
                        icon: (<FontAwesome name="bicycle" size={24} color={theme.color}/>)
                    },
                    
                    {
                        type: "mountain_bike",
                        name: "Mountain Bike",
                        icon: (<FontAwesome name="bicycle" size={24} color={theme.color}/>)
                    },
                    
                    {
                        type: "fixed_gear",
                        name: "Fixed Gear",
                        icon: (<FontAwesome name="bicycle" size={24} color={theme.color}/>)
                    },
                    
                    {
                        type: "touring_bike",
                        name: "Touring Bike",
                        icon: (<FontAwesome name="bicycle" size={24} color={theme.color}/>)
                    },
                    
                    {
                        type: "cruiser",
                        name: "Cruiser",
                        icon: (<FontAwesome name="bicycle" size={24} color={theme.color}/>)
                    }
                ]} onItemPress={(item) => setModel(item)}/>

                <CaptionText style={{ paddingHorizontal: 10 }}>Bike Images</CaptionText>

                <ScrollView horizontal={true} style={{ marginTop: -10 }}>
                    <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingTop: 10 }}>
                        {(images.map((image) => (
                            <View key={image.id} style={{
                                position: "relative",

                                height: 80,
                                width: 140,

                                backgroundColor: theme.placeholder,
                                borderRadius: 6
                            }}>
                                <Image source={{
                                    uri: image.base64
                                }} style={{
                                    height: 80,
                                    width: "100%",
                                    borderRadius: 6
                                }}/>

                                <TouchableOpacity style={{
                                    position: "absolute",

                                    top: -10,
                                    right: -10
                                }} onPress={() => setImages(images.filter((filterImage) => filterImage.id !== image.id))}>
                                    <View style={{
                                        backgroundColor: theme.background,

                                        width: 22,
                                        height: 22,

                                        borderRadius: 22,

                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <FontAwesome name="times" size={12} color={theme.color}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )))}

                        <TouchableOpacity style={{
                            height: 80,
                            width: 140,

                            borderRadius: 6,
                            borderColor: theme.border,

                            overflow: "hidden",

                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2
                        }} onPress={() => {
                            ImagePicker.launchImageLibraryAsync({
                                allowsMultipleSelection: true,
                                base64: true,
                                exif: false,
                                orderedSelection: true,
                                selectionLimit: 10
                            }).then((result) => {
                                if(!result.canceled) {
                                    const newImages = [ ...images ];

                                    for(let asset of result.assets) {
                                        if(asset.assetId && images.find((image) => image.assetId === asset.assetId))
                                            continue;

                                        newImages.push({
                                            id: uuid.v4() as string,
                                            assetId: asset.assetId,
                                            base64: "data:image/jpeg;base64," + asset.base64
                                        });
                                    }

                                    setImages(newImages);
                                }
                            })
                        }}>
                            <View style={{ position: "relative" }}>
                                <FontAwesome name="image" size={32} color={theme.color}/>
                                <FontAwesome name="plus" size={20} color={theme.color} style={{ 
                                    position: "absolute",

                                    right: -15,
                                    top: -10
                                }}/>
                            </View>

                            <ParagraphText>Add an image</ParagraphText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={{ paddingHorizontal: 10, gap: 10 }}>
                    <Button primary={true} label="Create bike" onPress={() => {
                        if(!model) {
                            Alert.alert("An error occured!", "You must select a bike model.");

                            return;
                        }

                        setUploading(true);

                        createBike(client, name, model?.type, images.map((image) => image.base64)).then((result) => {
                            if(result.success)
                                router.back();
                        });
                    }}/>

                    <Button primary={false} type="danger" label="Cancel" onPress={() => router.back()}/>
                </View>
            </View>

            {(uploading) && (
                <PageOverlay/>
            )}
        </ModalPage>
    );
};
