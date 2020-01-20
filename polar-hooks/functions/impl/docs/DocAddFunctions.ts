import * as functions from "firebase-functions";
import {AddURLs} from "polar-webapp-links/src/docs/AddURLs";
import {DatastoreFetchImports} from "../datastore/DatastoreFetchImports";
import {PreviewURLs} from "polar-webapp-links/src/docs/PreviewURLs";

export const DocAddFunction = functions.https.onRequest(async (req, res) => {

    // TODO: accept a POST here with the data int the body with the proper mine type

    console.log(`Handling url ${req.url} from originalURL: ${req.originalUrl}`);

    const parsedURL = AddURLs.parse(req.url);
    
    if (! parsedURL) {
        throw new Error("Wrong URL");
    }

    const importedDoc = await DatastoreFetchImports.doFetch(parsedURL.target);

    console.log("Parsed URL as: " + JSON.stringify(parsedURL, null, "   "));
    console.log("Imported doc to: " + JSON.stringify(importedDoc, null, "   "));

    const {url} = importedDoc;

    const previewURL = PreviewURLs.createPreviewURL(url, parsedURL.docInfo);

    console.log("Sending redirect to: " + previewURL);

    // TODO: in the future just change the request handler I think.
    res.redirect(previewURL);

});

