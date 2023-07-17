import { ReactNode, useEffect, useState, useCallback } from "react";
import { View, FlatList, RefreshControl, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";
import { ParagraphText } from "./texts/Paragraph";

export type FlatPlaginationProps = {
    style?: ViewStyle;
    data: any[];
    render: (item: FlatPlaginationProps["data"][0]) => React.ReactElement | null;
    paginate: (reset: boolean) => Promise<boolean>;
};

export default function FlatPagination({ style, data, render, paginate }: FlatPlaginationProps) {
    const theme = useTheme();

    const [ reachedEnd, setReachedEnd ] = useState<boolean>(false);
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const [ endReachedDuringMomentum, setEndReachedDuringMomentum ] = useState<boolean>(false);

    useEffect(() => {
        handleEndReached(true);
    }, []);

    const handleEndReached = useCallback((reset: boolean) => {
        if((!reset && !endReachedDuringMomentum && !reachedEnd) || reset) {
            paginate(reset).then((length: boolean) => {
                setRefreshing(false);
    
                if(!length) {
                    console.log("No more results to show in flatlist");

                    setReachedEnd(true);
                    return;
                }

                console.log("Paginating with new items in flatlist");
            });

            setEndReachedDuringMomentum(true);
        }
    }, [ endReachedDuringMomentum, refreshing ]);

    return (
        <FlatList
            data={data}
            renderItem={render}
            style={style}
            contentContainerStyle={{
                gap: 10,
                paddingBottom: 20
            }}

            ListFooterComponent={reachedEnd && (
                <View style={{ alignItems: "center", padding: 10 }}>
                    <ParagraphText>You've reached the end!</ParagraphText>
                </View>
            )}

            onEndReached={() => handleEndReached(false)}
            onMomentumScrollBegin={() => setEndReachedDuringMomentum(false)}

            refreshControl={(
                <RefreshControl
                    tintColor={theme.contrast}
                    refreshing={refreshing}
                    onRefresh={() => {
                    }}
                />
            )}
        >

        </FlatList>
    );
};
