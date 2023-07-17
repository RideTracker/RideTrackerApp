import getFormattedWords from "./getFormattedWords";

export default function getFormattedDuration(seconds: number, short: boolean = false) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = [];

    if(hours)
        result.push(`${hours}${(!short)?(` hr${((hours !== 1)?('s'):(''))}`):('h')}`);

    if(minutes)
        result.push(`${minutes}${(!short)?(` min${((minutes !== 1)?('s'):(''))}`):('m')}`);

    if(!hours && remainingSeconds && (!short || hours === 0))
        result.push(`${remainingSeconds}${(!short)?(` sec${((remainingSeconds !== 1)?('s'):(''))}`):('s')}`);

    return (!short)?(getFormattedWords(result)):(result.join(' '));
};
