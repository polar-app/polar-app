import {ArchiveTimestamps} from "./ArchiveTimestamps";
import {Wayback} from "./Wayback";
import {CacheFetches} from "./CacheFetches";
import {HackerNewsContents} from "./HackerNewsContents";

class PDFIndex {

    public doIndex(content: string) {
        const hackerNewsContents = HackerNewsContents.parse(content);

        for(const hackerNewsContent of hackerNewsContents) {
            if (hackerNewsContent.link.endsWith(".pdf")) {
                console.log("HIT: ", hackerNewsContent);
            }
        }

    }

}

export class Crawler {

    public static async exec() {

        const timestamp = "2019-01-01T00:00:00Z";
        // const timestamps = ArchiveTimestamps.create(timestamp, 24 * 60 * 60 * 1000, 365);
        const timestamps = ArchiveTimestamps.create(timestamp, 24 * 60 * 60 * 1000, 30);

        const pdfIndex = new PDFIndex();

        for (const timestamp of timestamps) {
            console.log("timestamp: " + timestamp);
            const waybackResponse = await Wayback.listArchives('https://news.ycombinator.com/', timestamp.yymmdd);

            const cacheURL = waybackResponse.archived_snapshots.closest.url;

            console.log("cacheURL: " + cacheURL);
            const content = await CacheFetches.fetch(cacheURL);

            pdfIndex.doIndex(content);

        }

    }



}

Crawler.exec()
    .then(() => console.log("Finished"))
    .catch(err => console.error(err));
