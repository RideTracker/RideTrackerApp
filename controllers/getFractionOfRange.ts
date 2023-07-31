export default function getFractionOfRange(value: number, minimum: number, maximum: number) {
    let relativeValue = value;

    if(minimum < 0) {
        maximum += Math.abs(minimum);
        relativeValue += Math.abs(minimum);
    }

    return relativeValue / maximum;
};
