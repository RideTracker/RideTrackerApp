import { useState, useEffect, ReactNode, RefObject } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { LayoutRectangle, RefreshControl, View, ViewStyle, PointProp } from "react-native";
import { ParagraphText } from "./texts/Paragraph";
import { useTheme } from "../utils/themes";
import React from "react";

type PaginationProps = {
    style: ViewStyle;
    items: string[];
    paginate: (reset: boolean) => Promise<boolean>;
    render: (item: string) => ReactNode;
    renderPlaceholder?: () => ReactNode;
    children?: ReactNode;
    contentOffset?: PointProp;
    scrollViewRef?: unknown;
    footer?: ReactNode;
};

export function Pagination(props: PaginationProps) {
    const { scrollViewRef, style, items, paginate, render, renderPlaceholder, children, contentOffset, footer } = props;

    const theme = useTheme();

    const [ reachedEnd, setReachedEnd ] = useState(false);
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ placeholderLayout, setPlaceholderLayout] = useState<LayoutRectangle>(null);

    const [ isAtBottom, setIsAtBottom ] = useState(false);

    async function getItems(reset = false) {
        if((!reset && reachedEnd) || loading)
            return;

        setLoading(true);

        const length = await paginate(reset);

        if(refreshing)
            setRefreshing(false);

        if(!length) {
            console.log("No more results to show");

            setLoading(false);
            setReachedEnd(true);

            return;
        }
        
        console.log("Paginating with new items");

        setLoading(false);
        setIsAtBottom(false);
    }


    // TODO: add a onContentResize handler to detect placeholders visible after a pagination?
    // or maybe not, we should check the result length...

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
        getItems(true);
    }, [ refreshing ]);

    return (
        <ScrollView ref={scrollViewRef as RefObject<ScrollView>} style={style} onScroll={handleScroll} scrollEventThrottle={100} contentOffset={contentOffset} refreshControl={
            <RefreshControl
                tintColor={theme.contrast}
                refreshing={refreshing}
                onRefresh={() => !refreshing && setRefreshing(true)}
            />
        }>
            {children}

            <View style={{ gap: 10, height: "100%" }}>
                {items.map((item) => <React.Fragment key={item}>{render(item)}</React.Fragment>)}

                {(!reachedEnd && renderPlaceholder) && (
                    <View style={{ gap: 10 }} onLayout={(event) => setPlaceholderLayout(event.nativeEvent.layout)}>
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

            {footer}
        </ScrollView>
    );
}
