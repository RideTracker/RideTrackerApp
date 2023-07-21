import { useState } from "react";
import { Switch, TouchableWithoutFeedback, View } from "react-native";
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

                <CaptionText>Show activities from</CaptionText>

                <SelectList active={selectListActive === "relations"} placeholder="Select activity relations..." initialValue={filter.find((item) => item.key === "relations")?.value ?? "everyone"} items={[
                    {
                        key: "following_or_follows",
                        text: "Only those I follow or follow me"
                    },

                    {
                        key: "following",
                        text: "Only those I follow"
                    },

                    {
                        key: "everyone",
                        text: "Everyone"
                    }
                ]} onChange={(value) => setFilter([ ...filter.filter((item) => item.key !== "relations"), { key: "relations", value } ])}
                onState={(active) => setSelectListActive((active)?("relations"):(null))}/>

                <View style={{
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <CaptionText style={{ flex: 1 }}>Include polls in my feed</CaptionText>

                    <Switch thumbColor={theme.brand} trackColor={theme.border} value={filter.find((item) => item.key === "includePolls")?.value ?? true} onValueChange={(value) => setFilter([ ...filter.filter((item) => item.key !== "includePolls"), { key: "includePolls", value } ])}/>
                </View>

                <View style={{
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <CaptionText style={{ flex: 1 }}>Show bike model in activities</CaptionText>

                    <Switch thumbColor={theme.brand} trackColor={theme.border} value={!user.hideBikeModelsInFeed} onValueChange={(value) => {
                        dispatch(setUserData({ hideBikeModelsInFeed: !value }));
                    }}/>
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

                    router.back();
                }}/>
            </View>
        </ModalPage>
    );
}
