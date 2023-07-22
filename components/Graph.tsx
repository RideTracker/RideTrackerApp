import { Dimensions, View } from "react-native";
import { ParagraphText } from "./texts/Paragraph";
import { GLView } from "expo-gl";
import { useTheme } from "../utils/themes";
import { ReactNode, useCallback, useEffect, useState } from "react";
import Expo2DContext from "expo-2d-context";
import { Point } from "react-native-maps";
import { getDistanceBetweenPoints } from "../controllers/polylines/getDistanceBetweenPoints";

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
        stroke?: string;
        strokeOpacity?: number;

        fill?: string;
        fillOpacity?: number;

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

        stepsX: number[];
        stepsY: number[];
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

            const stepsX = Array(horizontalSteps).fill((maximumX - minimumX) / (horizontalSteps - 1)).map((step, index) => minimumX + (step * index));
            const stepsY = Array(verticalSteps).fill((maximumY - minimumY) / (verticalSteps - 1)).map((step, index) => minimumY + (step * ((verticalSteps - 1) - index)));

            console.log({ stepsY, mid: maximumY - minimumY });

            setLimits({
                minimumX, maximumX,
                minimumY, maximumY,
                stepsX, stepsY
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
                const points: GraphDatasetPoints["points"] = [];

                {
                    const item = dataset.data[0];

                    const x = 5 + ((item.x - minimumX) / (maximumX - minimumX)) * width;
                    const y = 5 + ((item.y - maximumY) / (minimumY - maximumY)) * height;

                    //context.moveTo(x, y);

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

                    const previous = points[points.length - 1];

                    const distance = getDistanceBetweenPoints({ x: previous.location.x, y: 0 }, { x, y: 0 });

                    if(distance < 1) {
                        if(previous.y > item.y)
                            continue;

                        points[points.length - 1] = {
                            x: item.x,
                            y: item.y,
    
                            location: { x, y }
                        };
                    }
                    else {
                        //context.lineTo(x, y);

                        points.push({
                            x: item.x,
                            y: item.y,

                            location: { x, y }
                        });
                    }
                }

                if(dataset.fill) {
                    context.save();

                    context.beginPath();

                    context.moveTo(points[0].location.x, points[0].location.y);

                    for(let index = 1; index < points.length; index++)
                        context.lineTo(points[index].location.x, points[index].location.y);

                    context.lineTo(points[points.length - 1].location.x, height + 5);
                    context.lineTo(5, height + 5);

                    context.fillStyle = dataset.fill;

                    if(dataset.fillOpacity !== undefined)
                        context.globalAlpha = dataset.fillOpacity;

                    context.fill();

                    context.restore();
                }

                context.save();

                context.beginPath();

                context.moveTo(points[0].location.x, points[0].location.y);

                for(let index = 1; index < points.length; index++)
                    context.lineTo(points[index].location.x, points[index].location.y);

                context.lineCap = "round";
                
                context.lineWidth = scale * 1;
                context.strokeStyle = dataset.stroke ?? theme.brand;

                if(dataset.strokeOpacity !== undefined)
                    context.globalAlpha = dataset.strokeOpacity;

                context.stroke();

                context.restore();

                datasetPoints.push({ points });
            });

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
                    paddingBottom: 30
                }}>
                    {limits?.stepsY?.map((step, index) => (
                        <ParagraphText key={step} style={{
                            color: "silver",
                            fontSize: 12,
                            position: "absolute",
                            height: "100%",
                            top: `${(index === 0)?(0):(100 - (((step - limits.minimumY) / (limits.maximumY - limits.minimumY)) * 100))}%`
                        }}>
                            {(typeof(units.y) === "function")?(units.y(step)):(Math.floor(step).toString() + units.y)}
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
                        {limits?.stepsX.map((step, index, array) => (
                        <ParagraphText key={step} style={{
                            color: "silver",
                            fontSize: 12,
                            position: "absolute",
                            width: "100%",
                            textAlign: (index === array.length - 1)?("right"):("left"),
                            left: `${(index === array.length - 1)?(0):((step / (limits.maximumX - limits.minimumX)) * 100)}%`
                        }}>
                            {(typeof(units.x) === "function")?(units.x(step)):(Math.round(step).toString() + units.x)}
                        </ParagraphText>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    )
};
