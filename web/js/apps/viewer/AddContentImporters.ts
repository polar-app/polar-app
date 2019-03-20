import {DefaultAddContentImporter} from './AddContentImporter';
import {NullAddContentImporter} from './AddContentImporter';
import {IProvider} from '../../util/Providers';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';

export class AddContentImporters {

    public static create() {

        if (this.isPreview()) {
            return new DefaultAddContentImporter();
        }

        return new NullAddContentImporter();

    }

    private static isPreview(): boolean {
        const url = new URL(document.location!.href);
        return url.searchParams.get('preview') === 'true';
    }

}
