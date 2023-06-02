import { useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { CaptionText } from "../../../../components/texts/Caption";
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

    const [ filter, setFilter ] = useState<{
        key: string;
        value: string;
    }[]>(user.filters?.[filterType] ?? [])

    useEffect(() => {
        if(JSON.stringify(user.filters?.[filterType]) == JSON.stringify(filter))
            return;
            
        dispatch(setUserData({
            filters: {
                ...user.filters,
                
                [filterType]: filter
            }
        }));
    }, [ filter ]);

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

                <SelectList placeholder="Select activity order..." initialValue={filter.find((item) => item.key === "order")?.value ?? "activity"} items={[
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
                ]} onChange={(value) => setFilter([ ...filter, { key: "order", value } ])}/>

                <CaptionText>Include activities</CaptionText>

                <SelectList placeholder="Select activity timeline..." initialValue={filter.find((item) => item.key === "timeline")?.value ?? "lifetime"} items={[
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
                ]} onChange={(value) => setFilter([ ...filter, { key: "timeline", value } ])}/>
            </View>
        </View>
    );
}
