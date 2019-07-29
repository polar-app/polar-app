import {
    DefaultAddContentImporter,
    NullAddContentImporter
} from './AddContentImporter';
import {PreviewURLs} from './PreviewURLs';

export class AddContentImporters {

    public static create() {

        if (PreviewURLs.isPreview()) {
            return new DefaultAddContentImporter();
        }

        return new NullAddContentImporter();

    }

}
