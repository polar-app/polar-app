import {ArchiveTimestamps} from "./ArchiveTimestamps";
import {Wayback} from "./Wayback";
import {Latch} from "polar-shared/src/util/Latch";

export class Crawler {

    public static async exec() {

        const timestamp = "2019-01-01T00:00:00Z";
        const timestamps = ArchiveTimestamps.create(timestamp, 24 * 60 * 60 * 1000, 365);

        for (const timestamp of timestamps) {
            console.log("timestamp: " + timestamp);
            await Wayback.listArchives('https://news.ycombinator.com/', timestamp.yymmdd);
        }

    }

}

Crawler.exec()
    .then(() => console.log("Finished"))
    .catch(err => console.error(err));
