import React, { Component } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, RefreshControl } from "react-native";

import * as ImagePicker from "expo-image-picker";

import API from "app/Services/API";

import Appearance from "app/Data/Appearance";
import User from "app/Data/User";

import ActivityCompact from "app/Components/ActivityCompact.component";

import BikeCompact from "app/Components/BikeCompact.component";
import RouteCompact from "app/Components/RouteCompact.component";

import Header from "app/Components/Layouts/Header.component";

import { Form, Tabs } from "app/Components";

import style from "./ProfilePage.component.style";

export default class ProfilePage extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.tabs = React.createRef();
    };

    componentDidMount() {
        this.user = (this.props.user)?(this.props.user):(User.id);

        if(this.user) {
            API.get("/api/v1/user", { id: this.user }).then((data) => {
                this.setState({ user: data.content });
            });

            API.get("/api/v1/user/activity", { user: this.user }).then((data) => {
                this.setState({ activity: data.content });
            });

            API.get("/api/v1/user/activities", { user: this.user }).then((data) => {
                this.setState({ activities: data.content });
            });
    
            API.get("/api/v1/user/bikes", { user: this.user }).then((data) => {
                this.setState({ bikes: data.content });
            });
    
            API.get("/api/v1/user/routes", { user: this.user }).then((data) => {
                this.setState({ routes: data.content });
            });

            if(this.user != User.id) {
                API.get("/api/v1/user/follow", { user: this.user }).then((data) => {
                    this.setState({ follows: data.content });
                });
            }

            /*API.get("/api/v1/user/comments", { user: this.user }).then((data) => {
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

            await API.put("/api/v1/user/avatar", base64);
            await User.update();
            
            API.get("/api/v1/user", { id: this.user }).then((data) => {
                this.setState({ user: data.content });
            });
        }
    };

    async onFollowPress() {
        const response = await API.post("/api/v1/user/follow", { user: this.user });
        
        this.setState({ follows: response.content });
    };

    onRefresh() {
        this.setState({ refreshing: true });

        switch(this.tabs.current.getCurrent()) {
            case "activities": {
                API.get("/api/v1/user/activities", { user: this.user }).then((data) => {
                    this.setState({ refreshing: false, activities: data.content });
                });
                
                break;
            }

            case "bikes": {
                API.get("/api/v1/user/bikes", { user: this.user }).then((data) => {
                    this.setState({ refreshing: false, bikes: data.content });
                });
                
                break;
            }

            case "routes": {
                API.get("/api/v1/user/routes", { user: this.user }).then((data) => {
                    this.setState({ refreshing: false, routes: data.content });
                });
                
                break;
            }
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

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor={Appearance.theme.colorPalette.solid}
                            refreshing={this.state?.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                    >
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

                    {(this.state?.follows) && (
                        <TouchableOpacity onPress={() => this.onFollowPress()}>
                            <Text style={[ style.sheet.profile.item, style.sheet.profile.follow ]}>{(this.state?.follows)?("UNFOLLOW"):("FOLLOW")}</Text>
                        </TouchableOpacity>
                    )}

                    <Tabs ref={this.tabs} default="activities">
                        <View id="activities" title="Activities">
                            {this.state?.activities?.map((id) => (<ActivityCompact id={id} key={id} onPress={(id) => this.props.showModal("Activity", { id })}/>))}
                        </View>
                        
                        <View id="bikes" title="Bikes">
                            {this.state?.bikes?.map((id) => 
                                (<BikeCompact id={id} key={id} onPress={(id) => this.props.showNotification("This feature is not implemented yet!")}/>)
                            )}

                            <Form.Button style={style.sheet.button} title={"Add a new bike"} onPress={() => this.props.showModal("BikeCreation", { onFinish: () => this.onRefresh() })}/>
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
