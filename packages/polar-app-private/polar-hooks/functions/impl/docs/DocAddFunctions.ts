import * as functions from "firebase-functions";
import {AddURLs} from "polar-webapp-links/src/docs/AddURLs";
import {DatastoreFetchImports} from "../datastore/DatastoreFetchImports";
import {ExpressRequests} from "../util/ExpressRequests";
import {PreviewViewerURLs} from "polar-webapp-links/src/docs/PreviewViewerURLs";

export const DocAddFunction = functions.https.onRequest(async (req, res) => {

    // TODO: accept a POST here with the data int the body with the proper mine type

    const fullURL = ExpressRequests.toFullURL(req);

    console.log(`Handling full URL: ${fullURL}`);

    const parsedURL = AddURLs.parse(fullURL);
    
    if (! parsedURL) {
        throw new Error("Wrong URL");
    }

    const importedDoc = await DatastoreFetchImports.doFetch(parsedURL.target);

    console.log("Parsed URL as: " + JSON.stringify(parsedURL, null, "   "));
    console.log("Imported doc to: " + JSON.stringify(importedDoc, null, "   "));

    const {url} = importedDoc;

    const previewURL = PreviewViewerURLs.createPreviewURL(url, parsedURL.docInfo);

    console.log("Sending redirect to: " + previewURL);

    // TODO: in the future just change the request handler I think.
    res.redirect(previewURL);

});

