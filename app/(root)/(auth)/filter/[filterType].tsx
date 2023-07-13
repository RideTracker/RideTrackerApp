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
import Button from "../../../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectListOverlay from "../../../../components/SelectListOverlay";
import ModalPage from "../../../../components/ModalPage";
import FormCheckbox from "../../../../components/FormCheckbox";
import { ParagraphText } from "../../../../components/texts/Paragraph";

type FilterPageSearchParams = {
    filterType: string;
};

export default function FilterPage() {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useUser();
    const { filterType } = useSearchParams<FilterPageSearchParams>();

    const [ selectListActive, setSelectListActive ] = useState<string>(null);
    const [ filter, setFilter ] = useState<{
        key: string;
        value: any;
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
        <ModalPage midlays={(
            <SelectListOverlay active={selectListActive !== null} onCancel={() => {
                setSelectListActive(null);
            }}/>
        )}>
            <View style={{
                padding: 10,
                paddingBottom: 0,

                gap: 10
            }}>
                <CaptionText>Order activities by</CaptionText>

                <SelectList active={selectListActive === "order"} placeholder="Select activity order..." initialValue={filter.find((item) => item.key === "order")?.value ?? "activity"} items={[
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
                ]}
                onChange={(value) => {
                    setFilter([ ...filter.filter((item) => item.key !== "order"), { key: "order", value } ]);
                }}
                onState={(active) => setSelectListActive((active)?("order"):(null))}
                />

                <CaptionText>Include activities</CaptionText>

                <SelectList active={selectListActive === "timeline"} placeholder="Select activity timeline..." initialValue={filter.find((item) => item.key === "timeline")?.value ?? "lifetime"} items={[
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
                ]} onChange={(value) => setFilter([ ...filter.filter((item) => item.key !== "timeline"), { key: "timeline", value } ])}
                onState={(active) => setSelectListActive((active)?("timeline"):(null))}/>

                <CaptionText>Include:</CaptionText>

                <View style={{
                    flexDirection: "row",
                    gap: 10
                }}>
                    <FormCheckbox value={filter.find((item) => item.key === "includePolls")?.value ?? true} onChange={(value) => setFilter([ ...filter.filter((item) => item.key !== "includePolls"), { key: "includePolls", value } ])}/>

                    <ParagraphText>Polls</ParagraphText>
                </View>
                
                {(user.pollTimeout && user.pollTimeout > Date.now()) && (
                    <Button primary={false} label="Disable poll timeout" onPress={() => {
                        dispatch(setUserData({
                            pollTimeout: undefined
                        }));
                    }}/>
                )}

                <Button primary={false} type="danger" label="Reset all filters" onPress={() => {
                    setFilter([]);
                }}/>
            </View>
        </ModalPage>
    );
}
