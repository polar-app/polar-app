import {Fetches} from "polar-shared/src/util/Fetch";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {PassThrough, Writable} from 'stream';
import {Datastores} from "./Datastores";
import {File} from "@google-cloud/storage";
import {Paths} from "polar-shared/src/util/Paths";
import {PathStr, URLStr} from "polar-shared/src/util/Strings";
import {Backend} from "polar-firebase/src/firebase/datastore/Backend";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {FirebaseFileStorage} from "polar-firebase/src/firebase/files/FirebaseFileStorage";
import {DocCaches} from "./DocCaches";
import {Logger} from "polar-shared/src/logger/Logger";
import {URLs} from "polar-shared/src/util/URLs";
import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import { Lazy } from "polar-shared/src/util/Lazy";

const log = Logger.create();

const storageConfig = Lazy.create(() => Datastores.createStorage());

export class DatastoreFetchImports {

    public static async doFetch(docURL: URLStr): Promise<ImportedDoc> {

        if ( ! URLs.isWebScheme(docURL)) {
            throw new Error("URL needs to be http or https: " + docURL);
        }

        const cacheEntry = await DocCaches.getCached(docURL);

        if (cacheEntry) {
            return cacheEntry;
        }

        const importedDoc = await this.doFetchAndWriteStorageCache(docURL);

        await DocCaches.markCached(docURL, importedDoc);

        return importedDoc;

    }

    /**
     *
     */
    private static async doFetchAndWriteStorageCache(docURL: URLStr): Promise<ImportedDoc> {

        // create a random ID so we can use this with google cloud functions and write the data there for
        // just a moment.
        const tmpName = Hashcodes.createRandomID(20);

        log.notice("Fetching URL: " + docURL);

        // compute the new hashcode by streaming it through the fetch API...
        const response = await Fetches.fetch(docURL);

        const tmpFile = await this.createStorageTmpStream(tmpName);

        const filePromise = new Promise<boolean>(resolve => {
            tmpFile.stream.on('finish', () => {
                resolve(true);
            });
        });

        const hashcodeStream = new PassThrough();

        response.body.pipe(tmpFile.stream);
        response.body.pipe(hashcodeStream);

        const hashcodePromise = Hashcodes.createFromStream(hashcodeStream);
        const hashcode = await hashcodePromise;

        // wait for the file to be written to cloud storage.
        await filePromise;

        const contentType = response.headers.get('content-type');
        const newBasename = this.computeNewBasename(tmpFile.file, contentType, docURL);

        const streamRangeFactory = (start: number, end: number): NodeJS.ReadableStream => {
            return tmpFile.file.createReadStream({start, end});
        };

        if (! await PDFMetadata.isPDF(streamRangeFactory)) {
            throw new Error("URL is not a PDF: " + docURL);
        }

        const destination = `cache/${newBasename}`;
        await this.moveToCache(tmpFile.file, destination);

        // we need some basic docInfo here and then to import it directly into the users
        // datastore...

        const backend = Backend.CACHE;
        const fileRef: FileRef = {
            name: Paths.basename(destination),
        };

        // now compute theURL for this file in the backend.
        const storageURL = FirebaseFileStorage.computeDownloadURLDirectly(backend, fileRef);

        return {hashcode, destination, docURL, url: storageURL, storageURL};

    }

    private static async createStorageTmpStream(tmpName: string): Promise<TmpFile> {

        const {storage} = storageConfig();

        const project = storageConfig().config.project;

        const bucketName = `gs://${project}.appspot.com`;

        const bucket = storage.bucket(bucketName);

        const path = `tmp/${tmpName}`;
        const file = new File(bucket, path);
        const stream = file.createWriteStream();

        return {path, file, stream};

    }

    private static computeExt(contentType: string | undefined | null, url: string): string | undefined {

        if (contentType === 'application/pdf') {
            return 'pdf';
        }

        if (url.toLowerCase().endsWith(".pdf")) {
            return 'pdf';
        }

        return undefined;

    }

    private static computeNewBasename(source: File, contentType: string | undefined | null, url: string) {

        const basename = Paths.basename(source.name);

        const ext = this.computeExt(contentType, url);

        const suffix = ext ? ("." + ext) : '';

        return basename + suffix;

    }

    private static async moveToCache(source: File, destination: string) {
        await source.move(destination);
    }

}

interface TmpFile {
    readonly path: string;
    readonly file: File;
    readonly stream: Writable;
}

export interface ImportedDoc {
    readonly hashcode: string;
    readonly destination: PathStr;
    readonly docURL: URLStr;
    readonly storageURL: URLStr;
    readonly url: URLStr;
}
