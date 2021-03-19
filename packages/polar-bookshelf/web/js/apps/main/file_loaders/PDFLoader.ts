import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';

export class PDFLoader {

    public static createViewerURL(fingerprint: string,
                                  fileURL: string,
                                  filename: string) {

        return ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);

    }

}

