import { View, TouchableWithoutFeedback } from "react-native";

type SelectListOverlayProps = {
    active: boolean;
    onCancel: () => void;
};

export default function SelectListOverlay({ active, onCancel }: SelectListOverlayProps) {
    if(!active)
        return (null);

    return (
        <View style={{
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%"
        }}>
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => onCancel()}>
                <View style={{ flex: 1 }}/>
            </TouchableWithoutFeedback>
        </View>
    );
};
