import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, ScrollView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import * as ImagePicker from "expo-image-picker";

import API from "app/Services/API";

import Header from "app/Components/Layouts/Header.component";
import Input from "app/Components/Input.component";
import Button from "app/Components/Button.component";

import style from "./BikeCreation.style";

export default class BikeCreation extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.name = React.createRef();
        this.brand = React.createRef();
        this.model = React.createRef();
        this.year = React.createRef();
    };

    async onImageUpload() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [ 16, 9 ],
            quality: 1,
            base64: true
        });

        if(!result.cancelled) {
            const base64 = result.base64;

            this.setState({ image: result.uri, base64 });
        }
    };

    async onSubmit() {
        const options = {
            name: this.name.current.getValue(),
            brand: this.brand.current.getValue(),
            model: this.model.current.getValue(),
            year: this.year.current.getValue()
        };

        const bikeCreateResponse = await API.post("/api/v1/bike/create", options);
        const bikeCreateId = bikeCreateResponse.content;

        if(this.state?.base64) {
            await API.post("/api/v1/bike/image", {
                bike: bikeCreateId,
                image: this.state.base64
            });
        }

        if(this.props.onFinish)
            this.props.onFinish(bikeCreateId);

        this.props.onClose();
    };

    render() {
        return (
            <View style={style.sheet}>
                <Header
                    title="Bike Creation"
                    navigation="true"
                    onNavigationPress={() => this.props.onClose()}
                    />

                <ScrollView style={style.sheet.section}>
                    <TouchableOpacity onPress={() => this.onImageUpload()}>
                        {(this.state?.image)?(
                            <Image
                                style={style.sheet.image}
                                source={{
                                    uri: this.state.image
                                }}
                                />
                        ):(
                            <View style={[ style.sheet.form, style.sheet.placeholder ]}>
                                <FontAwesome5 style={style.sheet.placeholder.icon} name={"image"}/>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={[ style.sheet.form, style.sheet.form.description ]}>You must enter either a bike name or the detail details and upload an image of the bike.</Text>

                    <View style={style.sheet.form}>
                        <Text style={[ style.sheet.form, style.sheet.form.text ]}>What's your bike's name?</Text>

                        <Input
                            ref={this.name}
                            style={style.sheet.form.input}
                            placeholder="Bike name (optional)"
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            keyboardType={"default"}
                            autoCapitalize={"sentences"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.brand.current.focus()}
                            />
                    </View>

                    <View style={style.sheet.form}>
                        <Text style={[ style.sheet.form, style.sheet.form.text ]}>What model is your bike?</Text>

                        <Input
                            ref={this.brand}
                            style={style.sheet.form.input}
                            placeholder="Brand (optional)"
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            keyboardType={"default"}
                            autoCapitalize={"sentences"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.model.current.focus()}
                            />

                        <View style={style.sheet.form.grid}>
                            <Input
                                ref={this.model}
                                style={style.sheet.form.grid.input}
                                placeholder="Model (optional)"
                                clearButtonMode={"while-editing"}
                                enablesReturnKeyAutomatically={true}
                                keyboardType={"default"}
                                autoCapitalize={"sentences"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.year.current.focus()}
                                />

                            <Input
                                ref={this.year}
                                style={style.sheet.form.grid.input}
                                placeholder="Year (optional)"
                                clearButtonMode={"while-editing"}
                                enablesReturnKeyAutomatically={true}
                                keyboardType={"numeric"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.onSubmit()}
                                />
                        </View>
                    </View>
                </ScrollView>

                <View style={[ style.sheet.section ]}>
                    <Button style={style.sheet.form.input} title="Upload bike" branded onPress={() => this.onSubmit()}/>
                </View>
            </View>
        );
    };
};
