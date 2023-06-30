import DropdownPage from "../../../../../components/DropdownPage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../../../utils/themes";

export default function RecordingsDropdownPage() {
    const theme = useTheme();

    return (<DropdownPage items={[
        {
            text: "Upload all recordings",
            icon: (<MaterialCommunityIcons name="folder-upload-outline" size={24} color={theme.color}/>),

            onPress: () => {}
        },

        {
            text: "Delete all recordings",
            icon: (<MaterialCommunityIcons name="folder-remove-outline" size={24} color={theme.color}/>),

            onPress: () => {}
        }
    ]}/>)
};
