import {ResourcePaths} from '../../../util/ResourcePaths';
import {ViewerURLs} from "../doc_loaders/ViewerURLs";
import IViewerURL = ViewerURLs.IViewerURL;

export class EPUBLoader {

    public static createViewerURL(fingerprint: string): IViewerURL {
        const url = ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`);
        return {url};
    }

}

