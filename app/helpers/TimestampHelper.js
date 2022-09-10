export default class TimestampHelper {
    static getTimeAgo(date1, date2 = new Date()) {
        var seconds = Math.floor((date2 - date1) / 1000);

        var interval = seconds / 31536000;
      
        if (interval > 1) {
            interval = Math.floor(interval);
            return interval + " year" + ((interval != 1)?("s"):(""));
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            interval = Math.floor(interval);
            return interval + " month" + ((interval != 1)?("s"):(""));
        }
        interval = seconds / 86400;
        if (interval > 1) {
            interval = Math.floor(interval);
            return interval + " day" + ((interval != 1)?("s"):(""));
        }
        interval = seconds / 3600;
        if (interval > 1) {
            interval = Math.floor(interval);
            return interval + " hour" + ((interval != 1)?("s"):(""));
        }
        interval = seconds / 60;
        if (interval > 1) {
            interval = Math.floor(interval);
            return interval + " minute" + ((interval != 1)?("s"):(""));
        }
        return Math.floor(seconds) + " second" + ((interval != 1)?("s"):(""));
    };
}