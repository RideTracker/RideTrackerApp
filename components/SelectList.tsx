import React, { ReactNode, useState } from "react";
import { ScrollView, View } from "react-native";
import { ParagraphText } from "./texts/paragraph";
import FormInput from "./formInput";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/caption";
import { TouchableOpacity } from "react-native-gesture-handler";

type SelectListProps = {
    items: SelectListItem[];
    initialValue?: string;
    placeholder: string;
};

type SelectListItem = {
    key: string;
    text: string;
};

export function SelectList(props: SelectListProps) {
    const { items, initialValue, placeholder } = props;

    const theme = useTheme();

    const [ selectedItem, setSelectedItem ] = useState<string | null>(initialValue);
    const [ showItems, setShowItems ] = useState<boolean>(false);

    return (
        <View style={{
            position: "relative"
        }}>
            <TouchableOpacity style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 6,
                
                padding: 10
            }} onPress={() => setShowItems(true)}>
                <CaptionText>{(selectedItem)?(items.find((item) => item.key === selectedItem)?.text):(placeholder)}</CaptionText>
            </TouchableOpacity>

            {(showItems) && (
                <ScrollView style={{
                    position: "absolute",

                    left: 0,
                    bottom: 0,

                    width: "100%",
                    minHeight: "100%",
                   
                    backgroundColor: theme.background,
                    
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 6
                }}>
                    <View style={{ gap: 10 }}>
                        {items.map((item) => (
                            <TouchableOpacity key={item.key} style={{ padding: 10 }} onPress={() => {
                                setSelectedItem(item.key);
                                setShowItems(false);
                            }}>
                                <CaptionText>{item.text}</CaptionText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};
