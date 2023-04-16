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
        
        context.fillStyle = "green";
        context.fillRect(0, 0, 250 * pixelRatio, 250 * pixelRatio);

        await renderImage(canvasWebView, context, "e5b34eee-90b6-410d-4d39-3fcddcc59a00");
        await renderImage(canvasWebView, context, "8be37068-536a-434b-c833-456e3c741500");

        await context.executeBundle();
    };

    function renderImage(canvasWebView, context, avatar): Promise<void> {
        const pixelRatio = PixelRatio.get();

        return new Promise(async (resolve) => {
            const image = await canvasWebView.createImage();
    
            image.onload = async () => {
                const width = await image.width;
                const height = await image.height;
    
                context.drawImage(image, 0, 0, width * pixelRatio, height * pixelRatio);

                resolve();
            };
    
            image.src = `https://imagedelivery.net/iF-n-0zUOubWqw15Yx-oAg/${avatar}/avatarspreview`;
        });
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
        <CanvasWebView ref={canvasWebViewRef} width={250} height={250} onLoad={async (canvasWebView) => {
            const canvas = await canvasWebView.createCanvas();

            const pixelRatio = PixelRatio.get();

            canvas.width = 250 * pixelRatio;
            canvas.height = 250 * pixelRatio;
        
            setContext(await canvas.getContext("2d"));
        }}/>
    );
};
