import { ReactNode } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { CaptionText } from "./texts/Caption";
import { useTheme } from "../utils/themes";

export type CategorySelectorItem = {
    type: string;
    icon: ReactNode;
    name: string;
}

type CategorySelectorProps = {
    selectedItem: CategorySelectorItem;

    items: CategorySelectorItem[];

    onItemPress: (item: CategorySelectorItem) => void;
};

export default function CategorySelector({ selectedItem, items, onItemPress }: CategorySelectorProps) {
    const theme = useTheme();

    return (
        <ScrollView horizontal={true}>
            <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingBottom: 10 }}>
                {items.map((item) => (
                    <TouchableOpacity key={item.type} style={{
                        height: 40,

                        borderRadius: 6,
                        overflow: "hidden",

                        flexDirection: "row",
                        gap: 10,

                        alignItems: "center",

                        paddingHorizontal: 10,

                        backgroundColor: (selectedItem?.type === item.type)?(theme.highlight):(theme.placeholder),
                        borderWidth: 1,
                        borderColor: (selectedItem?.type === item.type)?(theme.border):("transparent")
                    }} onPress={() => onItemPress(item)}>
                        <View style={{ marginTop: -3, width: 40, flexDirection: "row", alignItems: "flex-start" }}>
                            {item.icon}
                        </View>

                        <CaptionText>{item.name}</CaptionText>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};
