import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import { useTheme } from "../../../../utils/themes";
import { Platform, View } from "react-native";
import { useUser } from "../../../../modules/user/useUser";
import TabBar from "../../../../components/TabBar";

export default function Layout() {
    const theme = useTheme();

    const userData = useUser();

    return (
        <Tabs tabBar={(props) => (<TabBar {...props}/>)} screenOptions={{
            headerStyle: {
                backgroundColor: theme.background,
                shadowColor: theme.border
            },

            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "500",
                color: theme.color
            },

            tabBarActiveTintColor: theme.color, 

            tabBarStyle: {
                backgroundColor: theme.background,
                paddingTop: 10,
                paddingBottom: (Platform.OS === "ios")?(25):(10),
                borderTopColor: theme.border
            },

            tabBarLabelStyle: {
                fontSize: 14
            },

            unmountOnBlur: true
        }}>
        </Tabs>
    );
}
