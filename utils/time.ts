export function timeSince(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1)
        return interval + " year" + (interval == 1 ? '' : 's') + " ago";

    interval = Math.floor(seconds / 2592000);

    if (interval >= 1)
        return interval + " month" + (interval == 1 ? '' : 's') + " ago";

    interval = Math.floor(seconds / 86400);

    if (interval >= 1)
        return interval + " day" + (interval == 1 ? '' : 's') + " ago";

    interval = Math.floor(seconds / 3600);

    if (interval >= 1)
        return interval + " hour" + (interval == 1 ? '' : 's') + " ago";

    interval = Math.floor(seconds / 60);

    if (interval >= 1)
        return interval + " minute" + (interval == 1 ? '' : 's') + " ago";

    return Math.floor(seconds) + " second" + (seconds == 1 ? '' : 's') + " ago";
};

export function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
