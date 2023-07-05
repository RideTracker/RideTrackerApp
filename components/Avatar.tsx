import { useEffect, useState, useRef, useCallback } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

type AvatarProps = {
    avatars: unknown[];
    combination: unknown;

    onDataUrl: (dataUrl: string | null) => void;
};

export default function Avatar(props: AvatarProps) {
    const { avatars, combination, onDataUrl } = props;

    const webViewRef = useRef<WebView>();

    const [ loaded, setLoaded ] = useState<boolean>(false);

    useEffect(() => {
        if(!loaded || !combination)
            return;

        onDataUrl(null);

        webViewRef.current.injectJavaScript(`render(JSON.parse(\`${JSON.stringify(combination)}\`)); null`);
    }, [ combination ]);

    useEffect(() => {
        if(!loaded || !combination)
            return;

        onDataUrl(null);

        console.log(JSON.parse(JSON.stringify(combination)));

        webViewRef.current.injectJavaScript(`render(JSON.parse(\`${JSON.stringify(combination)}\`)); null`);
    }, [ loaded ]);

    const handleWebViewEvent = useCallback((message) => {
        const data: {
            event: "error" | "image";
            message: string;
        } = JSON.parse(message);


        switch(data.event) {
            case "image": {
                onDataUrl(data.message)

                break;
            };

            case "error": {
                console.error(data.message);

                break;
            };
        }
    }, [ onDataUrl ]);
    
    return (
        <View style={{
            width: 225,
            height: 225
        }}>
            <WebView ref={webViewRef} onMessage={(event) => handleWebViewEvent(event.nativeEvent.data)} source={{
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                html: `
                    <style>
                        html, body {
                            margin: 0;
                            padding: 0;

                            width: 100vw;
                            height: 100vh;
                        }
                    </style>

                    <canvas id="canvas" style="width: 100%; height: 100%"></canvas>

                    <script type="text/javascript">
                        const images = {};

                        function getImage(id) {
                            return new Promise((resolve) => {
                                if(images[id])
                                    return resolve({ id, image: images[id] });

                                const image = new Image();

                                image.crossOrigin = "anonymous";
        
                                image.onload = () => {
                                    images[id] = image;

                                    return resolve({ id, image: images[id] });
                                };
        
                                image.src = "https://imagedelivery.net/iF-n-0zUOubWqw15Yx-oAg/" + id + "/AvatarImage";
                            });
                        };

                        async function render(combination) {
                            try {
                                const canvas = document.createElement("canvas");

                                canvas.width = 225 * window.devicePixelRatio;
                                canvas.height = 225 * window.devicePixelRatio;

                                const context = canvas.getContext("2d");

                                async function renderType(type) {
                                    const avatar = avatars.find((avatar) => avatar.id === combination[type].id);

                                    const images = await Promise.all(avatar.images.map((avatarImage) => {
                                        return getImage(avatarImage.image);
                                    }));

                                    avatar.images.sort((a, b) => a.index - b.index).forEach((avatarImage) => {
                                        const image = images.find((image) => image.id === avatarImage.image).image;

                                        if(!avatarImage.colorType) {
                                            context.drawImage(image, 0, 0, canvas.width, canvas.height);

                                            return;
                                        }

                                        const avatarColor = avatar.colors.find((avatarColor) => avatarColor.type === avatarImage.colorType);
                                        const combinationColor = combination[type].colors.find((combinationColor) => combinationColor.type === avatarImage.colorType);
                                        
                                        if(!(combinationColor?.color ?? avatarColor?.defaultColor)) {
                                            context.drawImage(image, 0, 0, canvas.width, canvas.height);

                                            return;
                                        }

                                        const imageCanvas = document.createElement("canvas");
                                        imageCanvas.width = image.width;
                                        imageCanvas.height = image.height;

                                        const imageContext = imageCanvas.getContext("2d");

                                        imageContext.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);

                                        imageContext.globalCompositeOperation = "multiply";

                                        imageContext.fillStyle = combinationColor?.color ?? avatarColor.defaultColor;
                                        imageContext.fillRect(0, 0, imageCanvas.width, imageCanvas.height);

                                        imageContext.globalCompositeOperation = "destination-in";
                                        
                                        imageContext.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);

                                        context.drawImage(imageCanvas, 0, 0, canvas.width, canvas.height);
                                    });
                                };

                                await renderType("head");
                                await renderType("jersey");

                                if(combination.sunglass)
                                    await renderType("sunglass");

                                if(combination.helmet)
                                    await renderType("helmet");

                                const destinationCanvas = document.getElementById("canvas");

                                destinationCanvas.width = 225 * window.devicePixelRatio;
                                destinationCanvas.height = 225 * window.devicePixelRatio;

                                const destinationContext = destinationCanvas.getContext("2d");

                                destinationContext.clearRect(0, 0, destinationCanvas.width, destinationCanvas.height);
                                destinationContext.drawImage(canvas, 0, 0);

                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    event: "image",
                                    message: canvas.toDataURL("image/png")
                                }));
                            }
                            catch(error) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    event: "error",
                                    message: error.message ?? error
                                }));
                            }
                        }; 
                    </script>
                `
            }}
            style={{
                flex: 1,
                backgroundColor: "transparent"
            }} 
            onLoad={() => setLoaded(true)}
            setBuiltInZoomControls={false}
            scalesPageToFit={false}
            scrollEnabled={false}
            overScrollMode={"never"}
            injectedJavaScriptBeforeContentLoaded={`window.avatars = JSON.parse(\`${JSON.stringify(avatars)}\`);`}/>
        </View>
    );
}
