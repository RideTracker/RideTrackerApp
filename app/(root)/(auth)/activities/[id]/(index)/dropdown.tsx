import { useTheme } from "../../../../../../utils/themes";
import DropdownPage from "../../../../../../components/DropdownPage";
import { FontAwesome5 } from '@expo/vector-icons';

export default function ActivityDropdownPage() {
    const theme = useTheme();

    return (<DropdownPage items={[
        {
            text: "Share activity",
            icon: (<FontAwesome5 name="share-square" size={22} color={theme.color}/>),

            onPress: () => {}
        }
    ]}/>)
};
