import { useDispatch } from "react-redux";
import DropdownPage from "../../../../../components/DropdownPage";
import ModalPage from "../../../../../components/ModalPage";
import { useTheme } from "../../../../../utils/themes";
import { FontAwesome5 } from "@expo/vector-icons";
import { setUserData } from "../../../../../utils/stores/userData";
import { useUser } from "../../../../../modules/user/useUser";
import { useRouter } from "expo-router";

export default function HidePollPage() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userData = useUser();
    const router = useRouter();

    return (
        <DropdownPage items={[
            {
                text: "Ask me again later",
                icon: (<FontAwesome5 name="clock" size={24} color={theme.color}/>),
                onPress: () => {
                    const date = new Date();

                    date.setHours(date.getHours() + 2);

                    dispatch(setUserData({
                        pollTimeout: date.getTime()
                    }));
                    
                    router.back();
                }
            },
            
            {
                text: "Never show me polls again",
                icon: (<FontAwesome5 name="times" size={24} color={theme.color}/>),
                onPress: () => {
                    const filter = userData.filters.feed ?? [];

                    dispatch(setUserData({
                        filters: {
                            ...userData.filters,
                            feed: [ ...filter.filter((item) => item.key !== "includePolls"), { key: "includePolls", value: false } ]
                        }
                    }));
                    
                    router.back();
                }
            }            
        ]}/>
    );
};
