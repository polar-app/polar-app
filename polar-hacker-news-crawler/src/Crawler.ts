import {ArchiveTimestamps} from "./ArchiveTimestamps";
import {Wayback} from "./Wayback";
import {CacheFetches} from "./CacheFetches";
import {HackerNewsContent, HackerNewsContents} from "./HackerNewsContents";

// TODO: pages 1-5 ... do every hour of the day???

class PDFIndex {

    private data: {[key: string]: HackerNewsContent} = {};

    public doIndex(content: string) {
        const hackerNewsContents = HackerNewsContents.parse(content);

        for (const hackerNewsContent of hackerNewsContents) {
            if (hackerNewsContent.link.endsWith(".pdf")) {
                console.log("HIT: ", hackerNewsContent);
                this.data[hackerNewsContent.link] = hackerNewsContent;

            }
        }

    }

    public dump() {
        return Object.values(this.data).sort((a, b) => b.score - a.score);
    }

}

export class Crawler {

    public static async exec() {

        const timestamp = "2019-01-01T00:00:00Z";
        // const timestamps = ArchiveTimestamps.create(timestamp, 24 * 60 * 60 * 1000, 365);
        const timestamps = ArchiveTimestamps.create(timestamp, 24 * 60 * 60 * 1000, 90);

        const pdfIndex = new PDFIndex();

        for (const timestamp of timestamps) {
            console.log("timestamp: " + timestamp);
            const waybackResponse = await Wayback.listArchives('https://news.ycombinator.com/', timestamp.yymmdd);

            const cacheURL = waybackResponse.archived_snapshots.closest.url;

            console.log("cacheURL: " + cacheURL);
            const content = await CacheFetches.fetch(cacheURL);

            pdfIndex.doIndex(content);

        }

        console.log(pdfIndex.dump());

    }



}

Crawler.exec()
    .then(() => console.log("Finished"))
    .catch(err => console.error(err));
