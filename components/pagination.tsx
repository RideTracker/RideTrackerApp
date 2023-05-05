import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { ParagraphText } from "./texts/paragraph";
import { useUser } from "../modules/user/useUser";

type PaginationProps = {
    style: any;
    paginate: any;
    render: any;
    children?: any;
    contentOffset?: any;
};

export function Pagination(props: PaginationProps) {
    const { style, paginate, render, children, contentOffset } = props;

    const [ items, setItems ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    const [ reachedEnd, setReachedEnd ] = useState(false);

    async function getItems() {
        if(reachedEnd)
            return;

        const result = await paginate(offset);

        if(!result) {

            console.log("reahed end");
            setReachedEnd(true);

            return;
        }

        setOffset(offset + result.length);
        setItems(items.concat(result));
    };

    useEffect(() => {
        getItems();
    }, []);

    const [ isAtBottom, setIsAtBottom ] = useState(false);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;

        setIsAtBottom(!!(scrollPosition + scrollViewHeight >= contentHeight - 10));
    };

    useEffect(() => {
        if(!isAtBottom)
            return;

        getItems();        
    }, [ isAtBottom ]);

    return (
        <ScrollView style={style} onScroll={handleScroll} scrollEventThrottle={100} contentOffset={contentOffset}>
            {children}

            <View style={{ gap: 10, height: "100%" }}>
                {items.map((item) => render(item))}

                {(reachedEnd) && (
                    <View style={{ alignItems: "center", padding: 10 }}>
                        <ParagraphText>You've reached the end!</ParagraphText>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
