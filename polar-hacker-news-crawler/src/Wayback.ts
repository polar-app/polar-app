export class Wayback {

    public static listArchives(url: string) {

        // find the timestamps based on the calendar...
        // timestamp is the timestamp to look up in Wayback. If not specified, the most recenty available capture in Wayback is returned. The format of the timestamp is 1-14 digits (YYYYMMDDhhmmss) ex:

        // http://archive.org/wayback/available?url=example.com&timestamp=20060101



    }

    private static computeAPI(url: string, timestamp: string) {

        const params = {
            url: encodeURIComponent(url),
            timestamp: encodeURIComponent(timestamp)
        };

        return `http://archive.org/wayback/available?url=${params.url}&timestamp=${params.timestamp}`;
    }

}
