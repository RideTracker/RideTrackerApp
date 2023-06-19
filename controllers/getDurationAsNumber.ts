export default function getDurationAsNumber(durations: string[]): number {
    if(durations.filter((duration) => duration[duration.length - 1] !== 's').length)
        throw new Error("Duration is not in seconds.");

    let seconds = 0;

    durations.forEach((duration) => {
        seconds += parseInt(duration.slice(0, duration.length - 1));
    });

    return seconds;
};
