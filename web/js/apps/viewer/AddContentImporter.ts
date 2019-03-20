import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {PDFImporter} from '../repository/importers/PDFImporter';
import {IProvider} from '../../util/Providers';
import {FilePaths} from '../../util/FilePaths';
import base = Mocha.reporters.base;
import {ImportedFile} from '../repository/importers/PDFImporter';
import {Optional} from '../../util/ts/Optional';
import {AddContentButtonOverlays} from './AddContentButtonOverlays';
import {Latches} from '../../util/Latches';
import {Latch} from '../../util/Latch';
import {ListenablePersistenceLayer} from '../../datastore/ListenablePersistenceLayer';

export interface AddContentImporter {

    /**
     * Perform anys setup.
     */
    prepare(): Promise<void>;

    /**
     * Do the actual import.
     */
    doImport(persistenceLayerProvider: IProvider<ListenablePersistenceLayer>): Promise<Optional<ImportedFile>>;

}

/**
 * Handles any issues with importing content into Polar
 */
export class DefaultAddContentImporter  implements AddContentImporter {

    // create a latch so that we can block the model until the
    // document was added.
    private latch = new Latch<boolean>();

    public async prepare(): Promise<void> {

        AddContentButtonOverlays.create(() => {

            // resolve the latch so we can move forward.
            this.latch.resolve(true);

        });

    }

    public async doImport(persistenceLayerProvider: IProvider<ListenablePersistenceLayer>) {

        const url = this.getURL();

        await this.latch.get();

        const basename = FilePaths.basename(url);
        const response = await fetch(url);
        const blob = await response.blob();
        const blobURL = URL.createObjectURL(blob);

        const pdfImporter = new PDFImporter(persistenceLayerProvider);

        return await pdfImporter.importFile(blobURL, basename);

    }

    private getURL() {
        const url = new URL(document.location!.href);
        return url.searchParams.get('file')!;
    }

}

export class NullAddContentImporter implements AddContentImporter {

    public async prepare(): Promise<void> {
        // noop
    }

    public async doImport(persistenceLayerProvider: IProvider<ListenablePersistenceLayer>): Promise<Optional<ImportedFile>> {
        return Optional.empty();
    }

}
