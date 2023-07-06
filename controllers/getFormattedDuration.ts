import getFormattedWords from "./getFormattedWords";

export default function getFormattedDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = [];

    if(hours)
        result.push(`${hours} hr${((hours !== 1)?('s'):(''))}`);

    if(minutes)
        result.push(`${minutes} min${((minutes !== 1)?('s'):(''))}`);

    if(!hours && remainingSeconds)
        result.push(`${remainingSeconds} sec${((remainingSeconds !== 1)?('s'):(''))}`);

    return getFormattedWords(result);
};
