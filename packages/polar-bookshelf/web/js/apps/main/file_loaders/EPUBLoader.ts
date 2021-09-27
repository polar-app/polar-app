import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';
import {ViewerURLs} from "../doc_loaders/ViewerURLs";
import IViewerURL = ViewerURLs.IViewerURL;

export class EPUBLoader {

    public static createViewerURL(fingerprint: string): IViewerURL {
        const url = ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);
        return {url};
    }

}

