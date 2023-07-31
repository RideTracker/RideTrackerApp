import * as chroma from "chroma.ts";

export default class Color {
    private color: string;

    public dark: string;
    public darker: string;
    public darkest: string;

    public bright: string;
    public brighter: string;
    public brightest: string;

    constructor(color: string) {
        const chromaColor = chroma.css(color);

        this.dark = chromaColor.darker(1).toSource();
        this.darker = chromaColor.darker(2).toSource();
        this.darkest = chromaColor.darker(3).toSource();
        
        this.bright = chromaColor.brighter(1).toSource();
        this.brighter = chromaColor.brighter(2).toSource();
        this.brightest = chromaColor.brighter(3).toSource();
    };

    toString(): string {
        return this.color;
    };
};
