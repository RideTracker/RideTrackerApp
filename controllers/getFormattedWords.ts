export default function getFormattedWords(words: string[]) {
    if(words.length > 1) {
        let result = words.slice(0, words.length - 1).join(', ');
        
        if(words.length > 2)
            result += ",";

        result += ` and ${words[words.length - 1]}`;

        return result;
    }
    else
        return words.join('');
};
