import React, { Component } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";

import * as ImagePicker from "expo-image-picker";

import API from "app/Services/API";

import User from "app/Data/User";

import Tabs from "app/Components/Tabs.component";
import Button from "app/Components/Button.component";
import ActivityCompact from "app/Components/ActivityCompact.component";

import BikeCompact from "app/Components/BikeCompact.component";
import RouteCompact from "app/Components/RouteCompact.component";

import Header from "app/Components/Layouts/Header.component";

import style from "./ProfilePage.component.style";

export default class ProfilePage extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);
    };

    componentDidMount() {
        this.user = (this.props.user)?(this.props.user):(User.id);

        if(this.user) {
            API.get("/api/user", { id: this.user }).then((data) => {
                this.setState({ user: data.content });
            });

            API.get("/api/user/activities", { user: this.user }).then((data) => {
                this.setState({ activities: data.content });
            });

            API.get("/api/user/bikes", { user: this.user }).then((data) => {
                this.setState({ bikes: data.content });
            });

            API.get("/api/user/routes", { user: this.user }).then((data) => {
                this.setState({ routes: data.content });
            });

            API.get("/api/user/activity", { user: this.user }).then((data) => {
                this.setState({ activity: data.content });
            });

            /*API.get("/api/user/comments", { user: this.user }).then((data) => {
                this.setState({ comments: data.content });
            });*/
        }
        else { 
            this.props.showModal("LoginPage");

            this.props.onNavigate("/index");
        }
    };

    async onAvatarPress() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });

        if(!result.cancelled) {
            const base64 = result.base64;

            await API.put("/api/user/avatar", base64);
            await User.update();
            
            API.get("/api/user", { id: this.user }).then((data) => {
                this.setState({ user: data.content });
            });
        }
    };

    render() { 
        return (
            <View style={style.sheet} timestamp={this.state?.timestamp}>
                { (this.user == User.id) ?
                    (<Header
                        title="Profile"

                        button="cog"
                        onButtonPress={() => this.props.showModal("ProfileSettings")}

                        navigation={(this.props?.onClose)}
                        onNavigationPress={() => this.props?.onClose()}
                        />)
                    :
                    (<Header
                        title="Profile"

                        navigation={(this.props?.onClose)}
                        onNavigationPress={() => this.props?.onClose()}
                        />)
                }

                <ScrollView>
                    <View style={[ style.sheet.profile.item, style.sheet.profile.avatar ]}>
                        {(this.user == User.id)?(
                            <TouchableOpacity onPress={() => this.onAvatarPress()}>
                                <Image
                                    style={style.sheet.profile.avatar.image}
                                    source={{
                                        uri: this.state?.user?.avatar
                                    }}
                                />
                            </TouchableOpacity>
                        ):(
                            <Image
                                style={style.sheet.profile.avatar.image}
                                source={{
                                    uri: this.state?.user?.avatar
                                }}
                            />
                        )}
                    </View>

                    <Text style={[ style.sheet.profile.item, style.sheet.profile.title ]}>{this.state?.user?.name}</Text>

                    <Text style={[ style.sheet.profile.item, style.sheet.profile.follow ]}>FOLLOW</Text>

                    <Tabs default="activities">
                        <View id="activities" title="Activities">
                            {this.state?.activities?.map((id) => (<ActivityCompact id={id} key={id} onPress={(id) => this.props.showModal("Activity", { id })}/>))}
                        </View>
                        
                        <View id="bikes" title="Bikes">
                            {this.state?.bikes?.map((id) => 
                                (<BikeCompact id={id} key={id} onPress={(id) => this.props.showModal("Bike", { id })}/>)
                            )}

                            <Button style={style.sheet.button} title={"Add a new bike"} onPress={() => this.props.showModal("BikeCreation")}/>
                        </View>
                        
                        <View id="routes" title="Routes">
                            {this.state?.routes?.map((id) => 
                                (<RouteCompact key={id} route={id} onPress={(id) => this.props.showModal("Routes", { route: id })}/>)
                            )}
                        </View>
                    </Tabs>
                </ScrollView>
            </View>
        );
    }
};
