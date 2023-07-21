import { View, Image, ImageStyle } from "react-native";
import { useUser } from "../../modules/user/useUser";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../../utils/themes";

const googleOnWhite = require("../../assets/extras/google/google_on_white.png");
const googleOnNonWhite = require("../../assets/extras/google/google_on_non_white.png");

type GoogleMapsLogoProps = {
    style?: ImageStyle;
};

export default function GoogleMapsLogo({ style }: GoogleMapsLogoProps) {
    const user = useUser();
    const theme = useTheme();

    if(user.mapProvider !== PROVIDER_GOOGLE)
        return null;

    return (
        <View style={style}>
            <Image source={(theme.contrast === "white")?(googleOnNonWhite):(googleOnWhite)} style={{
                width: 62,
                height: 18,
                margin: 2,
                resizeMode: "contain"
            }}/>
        </View>
    );
};
