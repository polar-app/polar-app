import {DOIStr, JSONStr, URLStr} from "polar-shared/src/util/Strings";
import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Files} from "polar-shared/src/util/Files";
import {
    DocPreview,
    DocPreviews,
    DocPreviewUncached
} from "polar-firebase/src/firebase/om/DocPreviews";
import {ArrayStreams} from "polar-shared/src/util/ArrayStreams";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {DocPreviewHashcodes} from "polar-firebase/src/firebase/om/DocPreviewHashcodes";
import {SendToQueue} from "./SendToQueue";
import {isPresent} from "polar-shared/src/Preconditions";
import {SlugStr} from "polar-shared/src/util/Slugs";

const LIMIT = 20000;

interface Args {
    readonly path: string;
    readonly category?: SlugStr;
}

function parseArgs(): Args {

    let path: string | undefined;
    let category: string | undefined;

    for (const arg of process.argv) {

        if (arg.startsWith('--path=')) {
            path = arg.split('=')[1];
        }

        if (arg.startsWith('--category=')) {
            category = arg.split('=')[1];
        }

    }

    if (! path) {
        throw new Error("no path");
    }

    return {path, category};

}

export class UnpaywallDocPreviewsLoader {

    public static async load() {

        const app = FirebaseAdmin.app();

        const args = parseArgs();

        const data = await Files.readFileAsync(args.path);
        const content = data.toString('utf-8');

        const toDocPreview = (json: JSONStr): DocPreviewUncached | undefined => {

            const doParse = () => {

                try {
                    return JSON.parse(json);
                } catch (e) {
                    return undefined;
                }
            };

            const doc: Unpaywall.Doc = doParse();

            if (! doc) {
                return undefined;
            }

            if (doc.oa_locations.length === 0) {
                // console.log("No open access locations (skipping): ", doc);
                return undefined;
            }

            const computeURLToPDF = (): URLStr | undefined => {

                const locations = doc.oa_locations.filter(current => isPresent(current.url_for_pdf));

                if (locations.length === 0) {
                    return undefined;
                }

                return locations[0].url_for_pdf || undefined;

            };

            const url = computeURLToPDF();

            if (! url) {
                // console.log("No URL to PDF: ", doc);
                return undefined;
            }

            const urlHash = DocPreviewHashcodes.urlHash(url);

            const docPreview: DocPreviewUncached = {
                id: urlHash,
                cached: false,
                url,
                urlHash,
                landingURL: doc.oa_locations[0].url_for_landing_page,
                title: doc.title,
                published: doc.published_date,
                publisher: doc.publisher || undefined,
                doi: doc.doi,
                doiURL: doc.doi_url,
            };

            return docPreview;

        };

        const toImportURL = (docPreview: DocPreview) => {
            return `https://app.getpolarized.io/doc-preview-import/${docPreview.url}`;
        };

        const docPreviews = ArrayStreams.create(content.split("\n"))
            .filter(line => line.trim() !== '')
            .head(LIMIT * 10)
            .map(toDocPreview)
            .filter(current => current !== undefined)
            .map(current => current!)
            .head(LIMIT)
            .collect();

        console.log("Working with N docPreviews: " + docPreviews.length);

        let processed: number = 0;

        for (const docPreview of docPreviews) {

            if (await DocPreviews.get(docPreview.urlHash)) {
                console.log('skipping');
                continue;
            }

            console.log('writing');
            await DocPreviews.set(docPreview);

            await SendToQueue.send(toImportURL(docPreview));

            // console.log("Import URL: " + );

            ++processed;

        }

        console.log("Processed: " + processed);


    }

}

export namespace Unpaywall {

    export interface Doc {
        readonly doi: DOIStr;
        readonly doi_url: URLStr;
        readonly updated: string;
        readonly title: string;
        readonly publisher: string;
        readonly z_authors: ReadonlyArray<Author>;
        readonly published_date: ISODateTimeString | ISODateString;
        readonly oa_locations: ReadonlyArray<Location>;
    }

    export interface Author {
        readonly family: string;
        readonly given: string;
    }

    export interface Location {
        readonly updated: ISODateTimeString;
        readonly is_best: boolean;
        readonly url_for_landing_page: URLStr;
        readonly url_for_pdf: URLStr | null;
    }

}

UnpaywallDocPreviewsLoader.load()
    .catch(err => console.error("Could not load doc previews: ", err));
