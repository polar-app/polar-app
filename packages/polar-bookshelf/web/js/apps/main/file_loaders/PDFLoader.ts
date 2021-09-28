import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';
import {ViewerURLs} from "../doc_loaders/ViewerURLs";

export namespace PDFLoader {

    import IViewerURL = ViewerURLs.IViewerURL;

    interface CreateOpts {
        readonly fingerprint: string;
        readonly page?: number;

    }

    export function createViewerURL(opts: CreateOpts): IViewerURL {

        const {fingerprint, page} = opts;

        const url = ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);

        if (page) {
            const initialUrl = url + `#?page=${page}`;
            return {url, initialUrl};
        }

        return {url};

    }

}

