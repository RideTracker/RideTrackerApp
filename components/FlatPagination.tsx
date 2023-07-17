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

    const handleEndReached = useCallback((reset?: boolean) => {
        if((!reset && !endReachedDuringMomentum && !reachedEnd) || reset) {
            console.log("Requesting pagination");

            paginate(reset).then((length: boolean) => {
                setRefreshing(false);
    
                if(!length) {
                    console.log("No more results to show in flatlist");

                    setReachedEnd(true);
                    return;
                }

                console.log("There's more to load");
            }).catch((error) => {
                setRefreshing(false);

                console.info("Error occured, disabling refresh");
                console.error(error);
            });

            setEndReachedDuringMomentum(true);
        }
    }, [ endReachedDuringMomentum, reachedEnd ]);

    return (
        <FlatList
            data={data}
            renderItem={render}
            style={{
                marginBottom: 20,

                ...style
            }}
            contentContainerStyle={{
                gap: 10,
                paddingBottom: 20
            }}

            ListFooterComponent={(
                <View>
                    {(reachedEnd) && (
                        <View style={{ alignItems: "center", padding: 10 }}>
                            <ParagraphText>You've reached the end!</ParagraphText>
                        </View>
                    )}
                </View>
            )}

            onEndReachedThreshold={0.2}
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
