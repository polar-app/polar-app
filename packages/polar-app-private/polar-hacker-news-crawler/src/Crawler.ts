import {ArchiveTimestamps} from "./ArchiveTimestamps";
import {Wayback} from "./Wayback";
import {CacheFetches} from "./CacheFetches";
import {HackerNewsContent, HackerNewsContents} from "./HackerNewsContents";
import {ArchiveLinks} from "./ArchiveLinks";
import { Files } from "polar-shared/src/util/Files";

// TODO: pages 1-5 ... do every hour of the day???

class PDFIndex {

    private data: {[key: string]: HackerNewsContent} = {};

    public doIndex(content: string) {
        const hackerNewsContents = HackerNewsContents.parse(content);

        for (const hackerNewsContent of hackerNewsContents) {
            if (hackerNewsContent.link.endsWith(".pdf")) {
                console.log("HIT: ", hackerNewsContent);

                const link = ArchiveLinks.source(hackerNewsContent.link);

                this.data[link] = {...hackerNewsContent, link};

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
        const timestamps = ArchiveTimestamps.create(timestamp, 12 * 60 * 60 * 1000, (365 * 2));

        const pdfIndex = new PDFIndex();

        for (const timestamp of timestamps) {
            console.log("timestamp: " + timestamp);

            const links = [
                'https://news.ycombinator.com/',
                'https://news.ycombinator.com/news?p=2'
            ];

            for (const link of links) {

                const waybackResponse = await Wayback.listArchives(link, timestamp.query);

                if (! waybackResponse.archived_snapshots.closest) {
                    continue;
                }

                const cacheURL = waybackResponse.archived_snapshots.closest.url;

                console.log("cacheURL: " + cacheURL);
                const content = await CacheFetches.fetch(cacheURL);

                pdfIndex.doIndex(content);

            }

        }

        const dumped = pdfIndex.dump();

        console.log("Found N links: " + dumped.length);

        // console.log(dumped);

        const json = JSON.stringify(dumped, null, "  ");
        await Files.writeFileAsync('crawler.json', json);

    }



}

Crawler.exec()
    .then(() => console.log("Finished"))
    .catch(err => console.error(err));
