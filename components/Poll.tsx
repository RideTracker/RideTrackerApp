import { GetPollResponse, getPoll } from "@ridetracker/ridetrackerclient";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useClient } from "../modules/useClient";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";
import FormDivider from "./FormDivider";
import { useTheme } from "../utils/themes";
import FormInput from "./FormInput";
import Button from "./Button";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export type PollProps = {
    id: string;
};

export default function Poll({ id }: PollProps) {
    const client = useClient();
    const theme = useTheme();
    const router = useRouter();

    const [ poll, setPoll ] = useState<GetPollResponse["poll"]>(null);
    const [ input, setInput ] = useState<number>(0);

    useEffect(() => {
        if(id) {
            getPoll(client, id).then((result) => {
                console.log(result);
                if(result.success) {
                    setPoll(result.poll);
                }
            });
        }
    }, [ id ]);

    return (
        <View style={{
            padding: 10,
            gap: 10
        }}>
            {(poll)?(
                <React.Fragment>
                    <View style={{
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <CaptionText style={{ flexGrow: 1 }}>{poll.title}</CaptionText>

                        <TouchableOpacity style={{
                            height: 22,
                            width: 22,

                            justifyContent: "center",
                            alignItems: "center"
                        }} onPress={() => router.push(`/polls/${poll.id}/hide`)}>
                            <FontAwesome5 name="times" size={18} color={theme.color}/>
                        </TouchableOpacity>
                    </View>

                    {(poll.description) && (<ParagraphText>{poll.description}</ParagraphText>)}

                    {(poll.inputs.length === poll.answers.length)?(
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10
                        }}>
                            <MaterialCommunityIcons name="hand-heart-outline" size={40} color={theme.brand}/>

                            <ParagraphText>Thank you for answering this poll!</ParagraphText>
                        </View>
                    ):(
                        <Button primary={true} label="Count me in!" onPress={() => router.push(`/polls/${poll.id}/answer`)}/>
                    )}
                </React.Fragment>
            ):(
                <View style={{
                    backgroundColor: theme.placeholder,
                    borderRadius: 6,
                    gap: 10
                }}>
                    <CaptionText/>
                    <ParagraphText/>
                    <Button primary={false}/>
                </View>
            )}
        </View>
    );
};
