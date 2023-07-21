export function getFormattedSentence(sentence: string, length: number) {
    let index = Math.min(sentence.length, length);

    for(; index !== -1; index--) {
        if(sentence[index] === " ")
            break;
    }

    const result = sentence.substring(0, (index <= 0)?(length):(index));

    return result + ((result.length < sentence.length)?("..."):(""));
};
