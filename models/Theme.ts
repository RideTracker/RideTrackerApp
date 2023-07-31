import Color from "./Color";

export type Theme = {
    background: string;
    color: string;
    placeholder: string;
    highlight: string;
    border: string;

    red: string;
    orange: string;

    brand: string;
    brandText: string;

    variants: {
        background: Color;
        color: Color;
        placeholder: Color;
        highlight: Color;
        border: Color;
    
        red: Color;
        orange: Color;
    
        brand: Color;
        brandText: Color;
    };

    contrast: "white" | "black";
    contrastStyle: "light" | "dark";

    mapStyle: any[];
};
