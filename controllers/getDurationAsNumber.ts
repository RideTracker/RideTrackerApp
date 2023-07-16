export default function getDurationAsNumber(duration: string): number {
    if(duration[duration.length - 1] !== 's')
        throw new Error("Duration is not in seconds.");

    let seconds = parseInt(duration.slice(0, duration.length - 1));

    return seconds;
};
