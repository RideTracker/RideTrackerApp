import { useEffect, useState, useRef } from "react";
import { Image, ScrollView, View, PixelRatio } from "react-native";
import CanvasWebView, { Path2D } from "react-native-webview-canvas";

export default function Avatar({ avatars, combination }) {
    const canvasWebViewRef = useRef();

    const [ context, setContext ] = useState(null);

    async function render() {
        const canvasWebView = canvasWebViewRef.current as CanvasWebView;

        const pixelRatio = PixelRatio.get();

        context.startBundle();

        context.clearRect(0, 0, 275 * pixelRatio, 275 * pixelRatio);
        
        await renderImage(canvasWebView, context, combination.head);
        await renderImage(canvasWebView, context, combination.jersey);

        if(combination.sunglass)
            await renderImage(canvasWebView, context, combination.sunglass);

        if(combination.helmet)
            await renderImage(canvasWebView, context, combination.helmet);

        await context.executeBundle();
    };

    function getImage(canvasWebView, id): Promise<any> {
        return new Promise(async (resolve) => {
            const image = await canvasWebView.createImage();
    
            image.onload = async () => {
                resolve(image);
            };
    
            image.src = `https://imagedelivery.net/iF-n-0zUOubWqw15Yx-oAg/${id}/AvatarImage`;
        });
    };

    async function renderImage(canvasWebView, context, avatarCombination) {
        const pixelRatio = PixelRatio.get();

        const avatar = avatars.find((avatar) => avatar.id === avatarCombination.id);

        for(let avatarImage of avatar.images.sort((a, b) => a.index - b.index)) {
            console.log("get image", avatarImage);

            const image = await getImage(canvasWebView, avatarImage.image);
    
            context.drawImage(image, 0, 0, 275 * pixelRatio, 275 * pixelRatio);
        }
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
            width: 225,
            height: 225
        }}>
            <CanvasWebView ref={canvasWebViewRef} width={275} height={275} onLoad={async (canvasWebView) => {
                const canvas = await canvasWebView.createCanvas();

                const pixelRatio = PixelRatio.get();

                canvas.width = 275 * pixelRatio;
                canvas.height = 275 * pixelRatio;

                const context = await canvas.getContext("2d");
            
                setContext(context);
            }}/>
        </View>
    );
};
