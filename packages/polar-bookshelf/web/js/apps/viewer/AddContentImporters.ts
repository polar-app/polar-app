import {
    DefaultAddContentImporter,
    NullAddContentImporter
} from './AddContentImporter';
import {PreviewViewerURLs} from "polar-webapp-links/src/docs/PreviewViewerURLs";

export class AddContentImporters {

    public static create() {

        if (PreviewViewerURLs.isPreview()) {
            return new DefaultAddContentImporter();
        }

        return new NullAddContentImporter();

    }

}
