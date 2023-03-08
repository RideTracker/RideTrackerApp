import { Image, Text, View } from "react-native";

type ActivityCommentProps = {
    style?: any;
};

export default function ActivityComment({ style }: ActivityCommentProps) {
    return (
        <View style={style}>
            <View style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                gap: 10
            }}>
                <Image
                    style={{
                        width: 40,
                        aspectRatio: 1,
                        borderRadius: 40,
                        overflow: "hidden"
                    }}
                    source={{
                        uri: "https://avatars.githubusercontent.com/u/78360666?v=4"
                    }}/>

                <View>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 5
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "bold"
                        }}>Nora Söderlund</Text>
                        <Text>14 hours ago</Text>
                    </View>

                    <Text style={{
                        fontSize: 17
                    }}>This is a comment!</Text>
                </View>
            </View>
        </View>
    );
};
