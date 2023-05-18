import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useTheme } from "../utils/themes";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { color } from "chroma.ts";
import { Draggable } from "./draggable";

const typeColors = [
    {
        type: "lips",
        colors: [
            "#EE7386", // pink
            "#FF0000", // red
            "#8B0000", // deep red
            "#FFB6C1", // light pink
            "#FF69B4", // dark pink
            "#FF7F50", // coral
            "#FFA500", // orange
            "#BA55D3", // mauve
            "#8B668B", // plum
            "#FFE4C4", // nude
            "#800080"  // berry
        ]
    },

    {
        type: "skin",
        colors: [
            "#FCE2C4", // light skin tone
            "#F8D1B9", // medium-light skin tone
            "#F1BEAC", // medium skin tone
            "#E8AE9E", // medium-dark skin tone
            "#D89E91", // dark skin tone
            "#C98E84", // very dark skin tone
            "#B97E77", // extra dark skin tone
            "#A96E6A", // deep skin tone
            "#986E64", // rich skin tone
            "#876D5E", // cocoa skin tone
            "#F0D9B5"  // olive skin tone
        ]
    },

    {
        type: "hair",
        colors: [
            "#000000", // black
            "#3B3024", // dark brown
            "#654321", // brown
            "#8B4513", // medium brown
            "#A52A2A", // auburn
            "#CD853F", // light brown
            "#FFD700", // blonde
            "#FFA500", // orange
            "#FF6347", // red
            "#FF69B4", // pink
            "#C71585"  // purple
        ]
    },

    {
        type: "eyes",
        colors: [
            "#000080", // dark blue
            "#1E90FF", // light blue
            "#006400", // dark green
            "#008000", // green
            "#556B2F", // hazel
            "#8B4513", // brown
            "#4B0082", // indigo
            "#483D8B", // dark violet
            "#9370DB", // medium purple
            "#FF69B4", // pink
            "#FFD700"  // golden
        ]
    },

    {
        type: "eyelashes",
        colors: [
            "#000000", // black
            "#3B3024", // dark brown
            "#654321", // brown
            "#8B4513", // medium brown
            "#A52A2A", // auburn
            "#CD853F", // light brown
            "#FFD700", // blonde
            "#FFA500", // orange
            "#FF6347", // red
            "#FF69B4", // pink
            "#C71585"  // purple
        ]
    },

    {
        type: "eyebrows",
        colors: [
            "#000000", // black
            "#3B3024", // dark brown
            "#654321", // brown
            "#8B4513", // medium brown
            "#A52A2A", // auburn
            "#CD853F", // light brown
            "#FFD700", // blonde
            "#FFA500", // orange
            "#FF6347", // red
            "#FF69B4", // pink
            "#C71585"  // purple
        ]
    },

    {
        type: "primary",
        colors: [
            "#F7D94C", // yellow
            "#FFA500", // orange
            "#FF6347", // coral
            "#FF69B4", // pink
            "#DA70D6", // orchid
            "#00BFFF", // deep sky blue
            "#4169E1", // royal blue
            "#2E8B57", // sea green
            "#228B22", // forest green
            "#A0522D", // sienna
            "#696969"  // dim gray
        ]
    },

    {
        type: "secondary",
        colors: [
            "#F7D94C", // yellow
            "#FFA500", // orange
            "#FF6347", // coral
            "#FF69B4", // pink
            "#DA70D6", // orchid
            "#00BFFF", // deep sky blue
            "#4169E1", // royal blue
            "#2E8B57", // sea green
            "#228B22", // forest green
            "#A0522D", // sienna
            "#696969"  // dim gray
        ]
    }
];

type ColorProps = {
    initialColor: string;
    defaultColor: string;
    type: string;
    picker: boolean;
    showPicker: (enable: boolean) => void;
    colorChange: (color: string) => void;
};

export function Colors(props: ColorProps) {
    const { initialColor, defaultColor, type, colorChange, picker, showPicker } = props;

    const theme = useTheme();

    const [ colors ] = useState([ defaultColor ].concat([ ...typeColors.find((typeColor) => typeColor.type === type)?.colors ]));
    const [ currentColor, setColor ] = useState<string>(initialColor);
    const [ currentColorCustom, setCurrentColorCustom ] = useState<boolean>(!colors.includes(initialColor));
    const [ currentColorHue, setCurrentColorHue ] = useState<number | null>(color(initialColor).hsv()[0]);
    const [ saturationDragging, setSaturationDragging ] = useState<boolean>(false);
    const [ hueDragging, setHueDragging ] = useState<boolean>(false);
    const [ position, setPosition ] = useState({
        scale: {
            left: color(initialColor).hsv()[1],
            top: 1 - color(initialColor).hsv()[2]
        }
    });
    const [ huePosition, setHuePosition ] = useState(null);

    useEffect(() => {
        colorChange(currentColor);
    }, [ currentColor ]);

    useEffect(() => {
        if(!saturationDragging && position) {
            setColor(color([ currentColorHue, position.scale.left, (1 - position.scale.top) ], "hsv").hex());

            setCurrentColorCustom(!colors.includes(initialColor));
        }
    }, [ saturationDragging ]);

    useEffect(() => {
        if(!hueDragging && huePosition) {
            setCurrentColorHue(huePosition.scale.left * 360);

            if(position) {
                setColor(color([ huePosition.scale.left * 360, position.scale.left, (1 - position.scale.top) ], "hsv").hex());

                setCurrentColorCustom(!colors.includes(initialColor));
            }
        }
    }, [ hueDragging ]);

    useEffect(() => {
        setColor(initialColor);
    }, []);

    return (
        <View>
            <ScrollView horizontal={true}>
                <View style={{
                    flexDirection: "row",
                    gap: 10,
                    paddingBottom: 10
                }}>
                    <TouchableOpacity style={{
                        width: 40,
                        height: 40,

                        borderWidth: 2,
                        borderColor: (currentColorCustom)?(theme.color):(theme.border),

                        borderRadius: 50,

                        overflow: "hidden",

                        backgroundColor: initialColor
                    }} onPress={() => {
                        if(!picker && position)
                            setColor(color([ currentColorHue, position.scale.left, (1 - position.scale.top) ], "hsv").hex());
                    
                        showPicker(!picker);
                    }}>
                        <Image source={require("./../assets/images/radial-gradient.png")} style={{
                            flex: 1,

                            width: 36,
                            height: 36
                        }}/>

                        <MaterialIcons name="colorize" size={24} color={theme.color} style={{
                            position: "absolute",

                            right: 0,
                            bottom: 0
                        }}/>
                    </TouchableOpacity>

                    {colors.map((color) => (
                        <TouchableOpacity key={color} style={{
                            width: 40,
                            height: 40,

                            borderWidth: 2,
                            borderColor: (currentColor === color)?(theme.color):(theme.border),

                            borderRadius: 50,

                            backgroundColor: color
                        }} onPress={() => {
                            setColor(color);
                            showPicker(false);
                            setCurrentColorCustom(false);
                        }}/>
                    ))}
                </View>
            </ScrollView>

            {(picker) && (
                <View style={{
                    flexDirection: "column",
                    gap: 10,
                    height: 200
                }}>
                    <View style={{
                        flex: 1
                    }}>
                        <LinearGradient colors={[ "white", `hsl(${currentColorHue}, 100%, 50%)` ]} start={[ 0, 0.5 ]} end={[ 1, 0.5 ]} style={{
                            borderRadius: 10,

                            height: "100%",
                            width: "100%",

                            position: "absolute",
                            left: 0,
                            top: 0
                        }}>
                            <LinearGradient colors={[ "transparent", "black" ]} style={{ flex: 1, height: 200 }}/>
                        </LinearGradient>
                        
                        <View style={{
                            height: "100%",
                            width: "100%",

                            position: "absolute",
                            left: 0,
                            top: 0
                        }}>
                            <Draggable initialLeft={color(currentColor).hsv()[1]} initialTop={1 - color(currentColor).hsv()[2]} draggingChange={(_dragging) => setSaturationDragging(_dragging)} positionChange={(position) => setPosition(position)}>
                                <View style={{
                                    width: (saturationDragging)?(80):(40),
                                    height: (saturationDragging)?(80):(40),

                                    marginLeft: -((saturationDragging)?(40):(20)),
                                    marginTop: -((saturationDragging)?(40):(20)),

                                    borderRadius: 50,

                                    backgroundColor: (position)?(
                                        color([ currentColorHue, position.scale.left, (1 - position.scale.top) ], "hsv").hex()
                                    ):(currentColor),

                                    borderWidth: 2,
                                    borderColor: theme.color
                                }}/>
                            </Draggable>
                        </View>
                    </View>

                    <View style={{
                        height: 30
                    }}>
                        <LinearGradient start={[ 0, 0.5 ]} end={[ 1, 0.5 ]} colors={Array(6).fill(null).map((_, index, array) => `hsl(${Math.round((360 / (array.length - 1)) * index)}, 100%, 50%)`)} style={{
                            borderRadius: 6,

                            height: "100%",
                            width: "100%",

                            position: "absolute",
                            left: 0,
                            top: 0
                        }}/>
                        
                        <View style={{
                            height: "100%",
                            width: "100%",

                            position: "absolute",
                            left: 0,
                            top: 0
                        }}>
                            <Draggable initialLeft={color(currentColor).hsl()[0] / 360} lockVertical={true} draggingChange={(_dragging) => setHueDragging(_dragging)} positionChange={(position) => setHuePosition(position)}>
                                <View style={{
                                    width: (hueDragging)?(80):(40),
                                    height: (hueDragging)?(80):(40),

                                    marginLeft: -((hueDragging)?(40):(20)),
                                    marginTop: -((hueDragging)?(40):(20)) + 15,

                                    borderRadius: 50,

                                    backgroundColor: color([ (huePosition)?(huePosition.scale.left * 360):(currentColorHue), 1, 1 ], "hsv").hex(),

                                    borderWidth: 2,
                                    borderColor: theme.color
                                }}/>
                            </Draggable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};
