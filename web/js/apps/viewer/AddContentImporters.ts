import {DefaultAddContentImporter} from './AddContentImporter';
import {NullAddContentImporter} from './AddContentImporter';
import {IProvider} from '../../util/Providers';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {PreviewURLs} from './PreviewURLs';

export class AddContentImporters {

    public static create() {

        if (PreviewURLs.isPreview()) {
            return new DefaultAddContentImporter();
        }

        return new NullAddContentImporter();

    }

}
