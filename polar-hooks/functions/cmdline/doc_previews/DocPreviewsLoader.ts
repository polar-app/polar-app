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

const LIMIT = 10000;

function getPath() {

    if (process.argv.length !== 3) {
        const command = process.argv[1];
        console.error(`SYNTAX ${command} [path]`);
        process.exit(1);
    }

    return process.argv[2];
}

export class DocPreviewsLoader {

    public static async load() {

        const app = FirebaseAdmin.app();

        const path = getPath();

        const data = await Files.readFileAsync(path);
        const content = data.toString('utf-8');

        const toDocPreview = (json: JSONStr): DocPreviewUncached | undefined => {

            const doc: Unpaywall.Doc = JSON.parse(json);

            if (doc.oa_locations.length === 0) {
                console.warn("No open access locations (skipping).");
                return undefined;
            }

            // TODO: authors

            const url = doc.oa_locations[0].url_for_pdf;

            if (url === null) {
                console.warn("No URL to PDF");
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
                                        .head(LIMIT * 4)
                                        .map(toDocPreview)
                                        .filter(current => current !== undefined)
                                        .map(current => current!)
                                        .head(LIMIT)
                                        .collect();

        for (const docPreview of docPreviews) {

            if (await DocPreviews.get(docPreview.urlHash)) {
                console.log('skipping');
                continue;
            }

            console.log('writing');
            await DocPreviews.set(docPreview);

            console.log("Import URL: " + toImportURL(docPreview));

        }

        console.log("Wrote N docPreviews: " + docPreviews.length);

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

DocPreviewsLoader.load()
    .catch(err => console.error("Could not load doc previews: ", err));
