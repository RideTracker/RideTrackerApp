import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

type SelectListProps = {
    active: boolean;
    items: SelectListItem[];
    initialValue?: string;
    placeholder: string;
    onChange: (value: string) => void;
    onState: (active: boolean) => void;
};

type SelectListItem = {
    key: string;
    text: string;
};

export function SelectList(props: SelectListProps) {
    const { active, items, initialValue, placeholder, onChange, onState } = props;

    const theme = useTheme();

    const [ selectedItem, setSelectedItem ] = useState<string | null>(initialValue);

    useEffect(() => {
        onChange(selectedItem);
    }, [ selectedItem ]);

    return (
        <View style={{
            position: "relative"
        }}>
            <TouchableOpacity style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 6,

                flexDirection: "row",
                gap: 10,
                
                padding: 10
            }} onPress={() => {
                onState(true);
            }}>
                <CaptionText style={{ flex: 1 }}>{(selectedItem)?(items.find((item) => item.key === selectedItem)?.text):(placeholder)}</CaptionText>
            
                <FontAwesome name="caret-down" size={18} color={theme.color}/>
            </TouchableOpacity>

            {(active) && (
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
                        {items.filter((item) => item.key !== selectedItem).map((item) => (
                            <TouchableOpacity key={item.key} style={{ padding: 10 }} onPress={() => {
                                setSelectedItem(item.key);
                                onState(false);
                            }}>
                                <CaptionText>{item.text}</CaptionText>
                            </TouchableOpacity>
                        ))}

                        {(selectedItem) && (
                            <TouchableOpacity key={selectedItem} style={{
                                padding: 10,
                                
                                borderTopColor: theme.border,
                                borderTopWidth: 1,

                                flexDirection: "row",
                                gap: 10,
                            }} onPress={() => {
                                setSelectedItem(selectedItem);
                                onState(false);
                            }}>
                                <CaptionText style={{ flex: 1 }}>{items.find((item) => item.key === selectedItem).text}</CaptionText>
                
                                <FontAwesome name="caret-up" size={18} color={theme.color}/>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}
