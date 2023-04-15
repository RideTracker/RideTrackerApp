import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { ParagraphText } from "./texts/paragraph";

export function Pagination({ style, paginate, render }) {
    const userData = useSelector((state: any) => state.userData);

    const [ items, setItems ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    const [ reachedEnd, setReachedEnd ] = useState(false);

    const router = useRouter();

    async function getItems() {
        if(reachedEnd)
            return;

        const result = await paginate(offset);

        if(!result) {
            setReachedEnd(true);

            return;
        }

        setOffset(offset + result.length);
        setItems(items.concat(result));
    };

    useEffect(() => {
        getItems();
    }, [ ]);

    const [ isAtBottom, setIsAtBottom ] = useState(false);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;

        setIsAtBottom(!!(scrollPosition + scrollViewHeight >= contentHeight));
    };

    useEffect(() => {
        if(!isAtBottom)
            return;

        getItems();        
    }, [ isAtBottom ]);

    return (
        <ScrollView style={style} onScroll={handleScroll} scrollEventThrottle={100}>
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
