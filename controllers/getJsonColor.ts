export default function getJsonColor(input: string, theme?: any) {
    try {
        let color = JSON.parse(input);

        if(theme?.contrast === "light") {
            for(let index = 0; index < color.length; index++)
                color[index] = 255 - color[index];
        }

        return `rgb(${color.join(', ')})`;
    }
    catch {
        return theme?.brand ?? "orange";
    }
};
