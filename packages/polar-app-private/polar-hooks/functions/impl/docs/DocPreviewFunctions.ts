import * as functions from "firebase-functions";
import {AddURLs} from "polar-webapp-links/src/docs/AddURLs";
import {DatastoreFetchImports} from "../datastore/DatastoreFetchImports";
import {ExpressRequests} from "../util/ExpressRequests";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {DocPreviews} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewHashcodes} from "polar-firebase/src/firebase/om/DocPreviewHashcodes";

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

    const updateDocPreviewCache = async () => {

        if (! docPreview) {
            // this is a raw URL
            return;
        }

        if (docPreview.cached) {
            // already cached.
            return;
        }

        console.log("Updating doc_preview cache");

        await DocPreviews.set({
            ...docPreview,
            docHash: importedDoc.hashcode,
            cached: true,
            datastoreURL: importedDoc.storageURL,
        });

    };

    await updateDocPreviewCache();

    const createRedirectURL = () => {

        if (docPreview) {
            return DocPreviewURLs.create({
                id: urlHash,
                category: docPreview.category,
                title: docPreview.title,
            });
        } else {
            return DocPreviewURLs.create({id: urlHash});
        }

    };

    const redirectURL = createRedirectURL();

    console.log("Sending redirect to: " + redirectURL);

    // TODO: in the future just change the request handler I think.
    res.redirect(redirectURL);

});

