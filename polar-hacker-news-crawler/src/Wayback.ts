/*

    {
      "timestamp": "20060101",
      "archived_snapshots": {
        "closest": {
          "status": "200",
          "available": true,
          "url": "http://web.archive.org/web/20060101064348/http://www.example.com:80/",
          "timestamp": "20060101064348"
        }
      },
      "url": "example.com"
    }

 */


import {CacheFetches} from "./CacheFetches";
import {Fetches} from "polar-shared/src/util/Fetch";

interface ArchivedSnapshot {
    readonly status: string;
    readonly available: boolean;
    readonly url: string;
    readonly timestamp: string;
}

interface ArchivedSnapshots {
    readonly closest: ArchivedSnapshot;
}
interface WaybackResponse {

    readonly timestamp: string;

    readonly url: string;

    readonly archived_snapshots: ArchivedSnapshots;

}

export class Wayback {

    public static async listArchives(url: string, timestamp: string): Promise<WaybackResponse> {

        // find the timestamps based on the calendar...
        // timestamp is the timestamp to look up in Wayback. If not specified, the most recenty available capture in Wayback is returned. The format of the timestamp is 1-14 digits (YYYYMMDDhhmmss) ex:

        // http://archive.org/wayback/available?url=example.com&timestamp=20060101

        const apiURL = this.computeAPI(url, timestamp);

        const content = await CacheFetches.fetch(apiURL);

        // const response = await Fetches.fetch(apiURL);
        // const content = await response.text();

        return JSON.parse(content);

    }

    private static computeAPI(url: string, timestamp: string) {

        const params = {
            url: encodeURIComponent(url),
            timestamp: encodeURIComponent(timestamp)
        };

        return `http://archive.org/wayback/available?url=${params.url}&timestamp=${params.timestamp}`;
    }

}
