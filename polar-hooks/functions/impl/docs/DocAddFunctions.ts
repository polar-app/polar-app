import * as functions from "firebase-functions";
import {AddURLs} from "polar-webapp-links/src/docs/AddURLs";
import {DatastoreFetchImports} from "../datastore/DatastoreFetchImports";
import {PreviewURLs} from "polar-webapp-links/src/docs/PreviewURLs";

export const DocAddFunction = functions.https.onRequest(async (req, res) => {

    // TODO: accept a POST here with the data int the body with the proper mine type

    const parsedURL = AddURLs.parse(req.url);
    
    if (! parsedURL) {
        throw new Error("Wrong URL");
    }

    const importedDoc = await DatastoreFetchImports.doFetch(parsedURL.target);
    console.log(importedDoc);

    const {url} = importedDoc;

    const previewURL = PreviewURLs.createPreviewURL(url, parsedURL.docInfo);

    // TODO: in the future just change the request handler I think.
    res.redirect(previewURL);

});

