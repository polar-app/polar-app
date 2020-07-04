import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';

export class EPUBLoader {

    public static createViewerURL(fingerprint: string) {
        return ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);
    }

}

