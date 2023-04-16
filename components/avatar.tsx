import { useEffect, useState, useRef } from "react";
import { Image, ScrollView, View, PixelRatio } from "react-native";
import CanvasWebView, { Path2D } from "react-native-webview-canvas";

export default function Avatar({ combination }) {
    const canvasWebViewRef = useRef();

    const [ context, setContext ] = useState(null);

    async function render() {
        const canvasWebView = canvasWebViewRef.current as CanvasWebView;

        const pixelRatio = PixelRatio.get();

        context.startBundle();

        context.clearRect(0, 0, 3000 * pixelRatio, 3000 * pixelRatio);
        
        await renderImage(canvasWebView, context, combination.head);
        await renderImage(canvasWebView, context, combination.jersey);

        if(combination.sunglass)
            await renderImage(canvasWebView, context, combination.sunglass);

        if(combination.helmet)
            await renderImage(canvasWebView, context, combination.helmet);

        await context.executeBundle();
    };

    function getImage(canvasWebView, avatar): Promise<any> {
        return new Promise(async (resolve) => {
            const image = await canvasWebView.createImage();
    
            image.onload = async () => {
                const width = await image.width;
                const height = await image.height;

                resolve({ image, width, height });
            };
    
            image.src = `https://imagedelivery.net/iF-n-0zUOubWqw15Yx-oAg/${avatar.id}/avatars`;
        });
    };

    async function renderImage(canvasWebView, context, avatar) {
        const pixelRatio = PixelRatio.get();

        const { image, width, height } = await getImage(canvasWebView, avatar);

        let left = 0, top = 0;

        const center = {
            left: avatar.left ?? Math.floor(avatar.width / 2),
            top: avatar.top ?? Math.floor(avatar.height / 2)
        };

        if(avatar.type === "jersey") {
            left = Math.floor(1500 - center.left);
            top = Math.ceil(3000 - avatar.height);
        }
        else {
            left = Math.floor(1500 - center.left);
            top = Math.floor(1500 - center.top);
        }

        context.drawImage(image, left * pixelRatio, top * pixelRatio, avatar.width * pixelRatio, avatar.height * pixelRatio);
    };

    useEffect(() => {
        if(!context)
            return;

        render();
    }, [ combination ]);

    useEffect(() => {
        if(!context)
            return;

        render();
    }, [ context ]);

    return (
        <View style={{
            width: 275,
            height: 275
        }}>
            <CanvasWebView ref={canvasWebViewRef} width={300} height={300} onLoad={async (canvasWebView) => {
                const canvas = await canvasWebView.createCanvas();

                const pixelRatio = PixelRatio.get();

                canvas.width = 300 * pixelRatio;
                canvas.height = 300 * pixelRatio;

                const context = await canvas.getContext("2d");

                context.startBundle();
        
                context.scale(.1, .1);

                await context.executeBundle();
            
                setContext(context);
            }}/>
        </View>
    );
};
