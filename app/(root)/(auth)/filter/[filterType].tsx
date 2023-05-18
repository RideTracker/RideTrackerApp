import { useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { CaptionText } from "../../../../components/texts/caption";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import { SelectList } from "../../../../components/SelectList";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../../utils/stores/userData";
import { useEffect } from "react";
import { useUser } from "../../../../modules/user/useUser";

type FilterPageSearchParams = {
    filterType: string;
};

export default function FilterPage() {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useUser();
    const { filterType } = useSearchParams<FilterPageSearchParams>();

    const [ order, setOrder ] = useState<string>(user.filters?.[filterType]?.order ?? "activity");
    const [ timeline, setTimeline ] = useState<string>(user.filters?.[filterType]?.timeline ?? "lifetime");

    useEffect(() => {
        if(JSON.stringify(user.filters?.[filterType]) == JSON.stringify({ order, timeline }))
            return;
            
        dispatch(setUserData({
            filters: {
                ...user.filters,
                
                [filterType]: {
                    order,
                    timeline
                }
            }
        }));
    }, [ order, timeline ]);

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <Stack.Screen options={{
                title: "Filter",
                contentStyle: {
                    backgroundColor: "transparent"
                }
            }}/>

            <TouchableWithoutFeedback style={{
                flex: 1
            }} onPress={() => router.back()}>
                <View style={{ flex: 1 }}/>
            </TouchableWithoutFeedback>

            <View style={{
                height: "auto",
                marginTop: "auto",

                backgroundColor: theme.background,
                padding: 10,
                paddingBottom: 30,

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,

                gap: 10
            }}>
                <CaptionText>Order activities by</CaptionText>

                <SelectList placeholder="Select activity order..." initialValue={order} items={[
                    {
                        key: "activity",
                        text: "Latest activity"
                    },

                    {
                        key: "distance",
                        text: "Longest distance"
                    },

                    {
                        key: "average_speed",
                        text: "Average speed"
                    },

                    {
                        key: "highest_speed",
                        text: "Highest speed"
                    },

                    {
                        key: "elevation",
                        text: "Highest elevation"
                    }
                ]} onChange={(value) => setOrder(value)}/>

                <CaptionText>Include activities</CaptionText>

                <SelectList placeholder="Select activity timeline..." initialValue={timeline} items={[
                    {
                        key: "week",
                        text: "Within last week"
                    },

                    {
                        key: "month",
                        text: "Within last month"
                    },

                    {
                        key: "half_year",
                        text: "Within last half year"
                    },

                    {
                        key: "year",
                        text: "Within last year"
                    },

                    {
                        key: "lifetime",
                        text: "Within lifetime"
                    }
                ]} onChange={(value) => setTimeline(value)}/>
            </View>
        </View>
    );
};
