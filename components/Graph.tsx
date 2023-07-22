import { Dimensions, View } from "react-native";
import { ParagraphText } from "./texts/Paragraph";
import { GLView } from "expo-gl";
import { useTheme } from "../utils/themes";
import { ReactNode, useCallback, useEffect, useState } from "react";
import Expo2DContext from "expo-2d-context";
import { Point } from "react-native-maps";

export type GraphDatasetPoints = {
    points: {
        location: Point;
        
        x: number;
        y: number;
    }[]
};

export type GraphProps = {
    children?: ReactNode;

    units: {
        x: ((value: number) => string) | string;
        y: ((value: number) => string) | string;
    },

    datasets: {
        data: {
            x: number;
            y: number;
        }[];
    }[];

    verticalSteps?: number;
    horizontalSteps?: number;

    onDatasetPoints: (datasets: GraphDatasetPoints[]) => void;
};

export default function Graph({ children, units, datasets, verticalSteps = 5, horizontalSteps = 5, onDatasetPoints }: GraphProps) {
    const theme = useTheme();

    const [ context, setContext ] = useState<Expo2DContext>(null);
    
    const [ limits, setLimits ] = useState<{
        minimumX: number;
        maximumX: number;
        
        minimumY: number;
        maximumY: number;
    }>(null);

    useEffect(() => {
        if(context) {
            const scale = Dimensions.get("screen").scale;

            const width = (context.width / scale) - 10;
            const height = (context.height / scale) - 10;

            const horizontals = datasets.flatMap((dataset) => dataset.data.map((data) => data.x));

            const minimumX = Math.min(...horizontals);
            const maximumX = Math.max(...horizontals);

            const verticals = datasets.flatMap((dataset) => dataset.data.map((data) => data.y));

            const minimumY = Math.min(...verticals);
            const maximumY = Math.max(...verticals);

            setLimits({
                minimumX, maximumX,
                minimumY, maximumY
            });

            {
                context.save();

                context.fillStyle = theme.background;
                context.fillRect(0, 0, context.width, context.height);

                context.restore();
            }

            {
                context.save();

                context.moveTo(5, 5);
                context.lineTo(5, 5 + height);
                context.lineTo(5 + width, 5 + height);

                context.strokeStyle = theme.border;
                context.lineWidth = scale * .5;

                context.stroke();

                context.restore();
            }

            const datasetPoints: GraphDatasetPoints[] = [];

            datasets.forEach((dataset) => {
                const points = [];

                context.beginPath();

                {
                    const item = dataset.data[0];

                    const x = 5 + ((item.x - minimumX) / (maximumX - minimumX)) * width;
                    const y = 5 + ((item.y - maximumY) / (minimumY - maximumY)) * height;

                    context.moveTo(x, y);

                    points.push({
                        x: item.x,
                        y: item.y,

                        location: { x, y }
                    });
                }


                for(let index = 1; index < dataset.data.length; index++) {
                    const item = dataset.data[index];
                    
                    const x = 5 + ((item.x - minimumX) / (maximumX - minimumX)) * width;
                    const y = 5 + ((item.y - maximumY) / (minimumY - maximumY)) * height;

                    context.lineTo(x, y);

                    points.push({
                        x: item.x,
                        y: item.y,

                        location: { x, y }
                    });
                }

                context.lineCap = "round";
                
                context.lineWidth = scale * 1;
                context.strokeStyle = theme.brand;
                context.stroke();

                datasetPoints.push({ points });
            });

            context.restore();

            context.flush();

            onDatasetPoints(datasetPoints);
        }
    }, [ context, theme ]);

    const handleContextCreate = useCallback((gl) => {
        const context = new Expo2DContext(gl as any, {
            fastFillTesselation: true,
            maxGradStops: 128,
            renderWithOffscreenBuffer: true
        });

        const scale = Dimensions.get("screen").scale;
        context.scale(scale, scale);

        setContext(context);
    }, [ theme ]);

    return (
        <View style={{
            flex: 1
        }}>
            <View style={{
                flex: 1,
                flexDirection: "row",
                paddingLeft: 5,
                gap: 5
            }}>
                <View style={{
                    width: 30,
                    position: "relative",
                    alignItems: "flex-end",
                    paddingBottom: 10
                }}>
                    {limits && Array(verticalSteps).fill(null).map((_, index) => (
                        <ParagraphText key={index} style={{
                            color: "silver",
                            fontSize: 12,
                            position: "absolute",
                            height: "100%",
                            textAlignVertical: (index === 0)?("top"):((index === 4)?("bottom"):("center")),
                            top: `${(index * (100 / (verticalSteps - 1))) - ((index === 0)?(0):((index === (verticalSteps - 1))?(100):(50)))}%`
                        }}>
                            {Math.round((limits.minimumY + ((verticalSteps - index) * ((limits.maximumY - limits.minimumY) / verticalSteps))))}{(typeof(units.y) === "function")?(units.y((limits.minimumY + ((verticalSteps - index) * ((limits.maximumY - limits.minimumY) / verticalSteps))))):(units.y)}
                        </ParagraphText>
                    ))}
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    paddingBottom: 5,
                    gap: 5
                }}>
                    <View style={{
                        flex: 1,
                        position: "relative"
                    }}>
                        <GLView style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%",
                            height: "100%"
                        }} onContextCreate={handleContextCreate}/>

                        {children}
                    </View>

                    <View style={{
                        position: "relative"
                    }}>
                        {limits && Array(horizontalSteps).fill(null).map((_, index) => (
                            <ParagraphText key={index.toString()} style={{
                                color: "silver",
                                fontSize: 12,
                                position: "absolute",
                                textAlign: (index === 0)?("left"):((index === (horizontalSteps - 1))?("right"):("center")),
                                width: "100%",
                                left: `${(index * (100 / (horizontalSteps - 1))) - ((index === 0)?(0):((index === (horizontalSteps - 1))?(100):(50)))}%`
                            }}>
                                {((typeof(units.x) === "function")?(units.x((limits.minimumX + (index * ((limits.maximumX - limits.minimumX) / horizontalSteps))))):(`${Math.round((limits.minimumX + (index * ((limits.maximumX - limits.minimumX) / horizontalSteps))))}${units.x}`))}
                            </ParagraphText>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    )
};
