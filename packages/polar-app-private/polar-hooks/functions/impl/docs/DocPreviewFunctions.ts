import * as functions from "firebase-functions";
import {AddURLs} from "polar-webapp-links/src/docs/AddURLs";
import {
    DatastoreFetchImports,
    ImportedDoc
} from "../datastore/DatastoreFetchImports";
import {ExpressRequests} from "../util/ExpressRequests";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {
    DocPreview,
    DocPreviewCached,
    DocPreviews
} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewHashcodes} from "polar-firebase/src/firebase/om/DocPreviewHashcodes";
import {Slugs} from "polar-shared/src/util/Slugs";
import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import {DOIStr, PlainTextStr} from "polar-shared/src/util/Strings";
import {ARXIVSearchEngine} from "polar-search/src/search/arxiv/ARXIVSearchEngine";
import {TextSerializer} from "polar-html/src/sanitize/TextSerializer";
import {DocPreviewsPrerenderer} from "../../cmdline/doc_previews/DocPreviewsPrerenderer";

// FIXME: this should not just return HTTP 500 (unhandled exception) if something
// happens but should instead return HTTP 200 or send a redirect to a page
// explaining that an error occurred.  I don't want to send JSON or HTML either
// though..

export interface CoreDocMetadata {
    readonly doi?: DOIStr;
    readonly description?: string;
    readonly nrPages?: number;
}

export class CoreDocMetadatas {

    private static async fetchPDFMetadata(importedDoc: ImportedDoc): Promise<CoreDocMetadata> {

        const metadata = await PDFMetadata.getMetadata(importedDoc.storageURL);

        return {
            doi: metadata.doi,
            description: metadata.description,
            nrPages: metadata.nrPages
        };

    }

    private static async fetchArxivMetadata(doi: string): Promise<CoreDocMetadata> {

        const engine = new ARXIVSearchEngine({
            q: doi
        });

        const results = await engine.executeQuery();

        if (results.entries.length === 0) {
            return {};
        }

        const entry = results.entries[0];

        const toSummary = (): PlainTextStr | undefined => {

            if (! entry.summary) {
                return undefined;
            }

            if (entry.summary.type === 'text') {
                return entry.summary.value;
            }

            return TextSerializer.serialize(entry.summary.value);

        };

        // FIXME: authors are important here and they're provided via arxiv so we
        // should store them.
        return {
            doi,
            description: toSummary(),
            nrPages: undefined
        };

    }

    /**
     * Use the PDF metadata and arxiv (and other systems) to build extended
     * metadata for PDFs.
     */
    public static async fetch(docPreview: DocPreview,
                              importedDoc: ImportedDoc) {

        // TODO: get better on handling exceptions here

        const pdfMetadata = await this.fetchPDFMetadata(importedDoc);

        const doi = docPreview.doi || pdfMetadata.doi;

        const arxivMetadata = doi ? await this.fetchArxivMetadata(doi) : {};

        return this.merge(pdfMetadata, arxivMetadata);

    }

    private static merge(a: CoreDocMetadata, b: CoreDocMetadata): CoreDocMetadata {
        return {
            doi: a.doi || b.doi,
            description: a.description || b.description,
            nrPages: a.nrPages || b.nrPages
        };
    }

}


/**
 * This function takes a document via HTTP POST, performs an analysis on it, then
 * indexes its metadata using various APIs, then writes it to the index so that
 * we have the correct metadata we need.
 *
 * TODO:
 *
 * - the metadata we have from fatcat and unpaywall doesn't have a summary
 * - pubmed DOES have extended metadata but not everything has a pmid
 */
export const DocPreviewFunction = functions.https.onRequest(async (req, res) => {

    // TODO: accept a POST here with the data int the body with the proper mine type

    const fullURL = ExpressRequests.toFullURL(req);

    console.log(`Handling full URL: ${fullURL}`);

    const parsedURL = AddURLs.parse(fullURL);
    
    if (! parsedURL) {
        throw new Error("Wrong URL: " + fullURL);
    }

    // this will return immediately due to the cache after the first
    const importedDoc = await DatastoreFetchImports.doFetch(parsedURL.target);

    const urlHash = DocPreviewHashcodes.urlHash(parsedURL.target);

    const docPreview = await DocPreviews.get(urlHash);

    console.log("Parsed URL as: " + JSON.stringify(parsedURL, null, "   "));
    console.log("Imported doc to: " + JSON.stringify(importedDoc, null, "   "));
    console.log("DocPreview: " + JSON.stringify(docPreview, null, "   "));

    if (docPreview) {

        // this should generally be fast because we're now reading from a storage
        // URL
        const metadata = await CoreDocMetadatas.fetch(docPreview, importedDoc);

        const slug = docPreview.title ? Slugs.calculate(docPreview.title) : undefined;

        const setDocPreview = async (docPreview: DocPreview): Promise<DocPreviewCached> => {

            console.log("Writing doc_preview cache");

            const docPreviewCached: DocPreviewCached = {
                ...docPreview,
                id: docPreview.id || docPreview.urlHash,
                docHash: importedDoc.hashcode,
                cached: true,
                datastoreURL: importedDoc.storageURL,
                doi: docPreview.doi || metadata.doi,
                description: docPreview.description || metadata.description,
                nrPages: metadata.nrPages,
                slug
            };

            await DocPreviews.set(docPreviewCached);

            return docPreviewCached;

        };

        const prerenderDocPreview = async (docPreview: DocPreviewCached) => {
            console.log("Submitting to prerender.io to precache/prerender for SEO");
            await DocPreviewsPrerenderer.submit(docPreview);
        };

        const docPreviewCached = await setDocPreview(docPreview);

        await prerenderDocPreview(docPreviewCached);

        const redirectURL = DocPreviewURLs.create({
            id: urlHash,
            category: docPreview.category,
            title: docPreview.title,
            slug,
        });

        res.redirect(redirectURL);

    } else {

        const redirectURL = DocPreviewURLs.create({
            id: urlHash,
            category: undefined,
            title: undefined,
            slug: undefined
        });

        res.redirect(redirectURL);

    }

});
