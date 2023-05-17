import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { LayoutRectangle, RefreshControl, View } from "react-native";
import { useSelector } from "react-redux";
import { ParagraphText } from "./texts/paragraph";
import { useUser } from "../modules/user/useUser";
import { useTheme } from "../utils/themes";
import React from "react";

type PaginationProps = {
    style: any;
    paginate: any;
    render: any;
    renderPlaceholder?: any;
    children?: any;
    contentOffset?: any;
};

export function Pagination(props: PaginationProps) {
    const { style, paginate, render, renderPlaceholder, children, contentOffset } = props;

    const theme = useTheme();

    const [ items, setItems ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    const [ reachedEnd, setReachedEnd ] = useState(false);
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ placeholderLayout, setPlaceholderLayout] = useState<LayoutRectangle>(null);

    const [ isAtBottom, setIsAtBottom ] = useState(false);

    async function getItems(currentOffset = offset, currentItems = items, clearItems = false) {
        if(reachedEnd || loading)
            return;

        setLoading(true);

        const result = await paginate(currentOffset);

        if(!result?.length) {
            console.log("No more results to show");

            setLoading(false);
            setReachedEnd(true);

            return;
        }
        
        console.log("Paginating with new items");

        if(clearItems)
            setItems([]);

        setLoading(false);

        setOffset(currentOffset + result.length);
        setItems(currentItems.concat(result));

        console.log("Items cached are " + (currentItems.length + result.length) + " and offset is " + (currentOffset + result.length));

        if(refreshing)
            setRefreshing(false);
        
        setIsAtBottom(false);
    };

    useEffect(() => {
        getItems();
    }, []);

    const handleScroll = (event) => {
        if(reachedEnd)
            return;

        const scrollPosition = event.nativeEvent.contentOffset.y;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;

        const placeholderIsVisible = (scrollPosition + scrollViewHeight >= (placeholderLayout?.y ?? contentHeight));

        setIsAtBottom(placeholderIsVisible);
    };

    useEffect(() => {
        if(!isAtBottom || reachedEnd)
            return;

        console.log("Reached the bottom");

        getItems();        
    }, [ isAtBottom ]);

    useEffect(() => {
        getItems(0, [], true);        
    }, [ refreshing ]);

    return (
        <ScrollView style={style} onScroll={handleScroll} scrollEventThrottle={100} contentOffset={contentOffset} refreshControl={
            <RefreshControl
                tintColor={theme.contrast}
                refreshing={refreshing}
                onRefresh={() => !refreshing && setRefreshing(true)}
                />
        }>
            {children}

            <View style={{ gap: 10, height: "100%" }}>
                {items.map((item) => render(item))}

                {(!reachedEnd && renderPlaceholder) && (
                    <View style={{backgroundColor:"red"}} onLayout={(event) => setPlaceholderLayout(event.nativeEvent.layout)}>
                        {Array(5).fill(null).map((_, index) => (
                            <React.Fragment key={index}>
                                {renderPlaceholder()}
                            </React.Fragment>
                        ))}
                    </View>
                )}

                {(reachedEnd) && (
                    <View style={{ alignItems: "center", padding: 10 }}>
                        <ParagraphText>You've reached the end!</ParagraphText>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
