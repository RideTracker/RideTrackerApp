import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActivityIndicator, Alert, View } from "react-native";
import ModalPage from "../../../../../components/ModalPage";
import { useTheme } from "../../../../../utils/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { setUserData } from "../../../../../utils/stores/userData";
import { useUser } from "../../../../../modules/user/useUser";
import { useSearchParams } from "expo-router";
import { GetPollResponse, createPollAnswer, getPoll } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../../modules/useClient";
import { CaptionText } from "../../../../../components/texts/Caption";
import { ParagraphText } from "../../../../../components/texts/Paragraph";
import FormDivider from "../../../../../components/FormDivider";
import FormInput from "../../../../../components/FormInput";
import Button from "../../../../../components/Button";

export default function AnswerPollPage() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userData = useUser();
    const client = useClient();
    const { pollId } = useSearchParams();

    const [ poll, setPoll ] = useState<GetPollResponse["poll"]>(null);
    const [ input, setInput ] = useState<number>(0);
    const [ uploading, setUploading ] = useState<boolean>(false);
    const [ text, setText ] = useState<string>("");

    useEffect(() => {
        if(pollId) {
            getPoll(client, pollId as string).then((result) => {
                if(result.success) {
                    setPoll(result.poll);
                    setInput(result.poll.answers.length);

                    for(let input of result.poll.inputs) {
                        if(result.poll.answers.find((answer) => answer.input === input.id))
                            continue;

                        setInput(result.poll.inputs.indexOf(input));

                        break;
                    }
                }
            });
        }
    }, [ pollId ]);

    return (
        <ModalPage>
            <View style={{
                padding: 10,
                gap: 10
            }}>
                <CaptionText placeholder={!poll}>{poll?.title}</CaptionText>

                {(!poll || poll.description) && (<ParagraphText placeholder={!poll}>{poll?.description}</ParagraphText>)}

                <FormDivider/>

                {(poll && (input === poll.inputs.length || poll.inputs.length === poll.answers.length))?(
                    <React.Fragment>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10
                        }}>
                            <MaterialCommunityIcons name="hand-heart-outline" size={40} color={theme.brand}/>

                            <ParagraphText>Thank you for answering this poll!</ParagraphText>
                        </View>
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        <ParagraphText placeholder={!poll}>{(input + 1)}. {poll?.inputs?.[input]?.title}</ParagraphText>
        
                        <FormInput key={input} placeholder="Enter your answer..." props={{
                            onChangeText: (text) => setText(text)
                        }}/>
        
                        <Button primary={true} label={!uploading && "Submit answer"} onPress={() => {
                            setUploading(true);

                            createPollAnswer(client, poll.id, poll.inputs[input].id, text).then((result) => {
                                if(result.success)
                                    setInput(input + 1);
                                else if(result.message)
                                    Alert.alert("Something went wrong!", result.message);

                                setUploading(false);
                            });
                        }}>
                            {(uploading) && (
                                <ActivityIndicator size={24}/>
                            )}
                        </Button>
                    </React.Fragment>
                )}
            </View>
        </ModalPage>
    );
};
