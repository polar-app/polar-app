import {getConfig} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {URLStr} from "polar-shared/src/util/Strings";
import {ICollectionReference} from "polar-firestore-like/src/ICollectionReference";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export namespace FileTombstones {

    const STORAGE_BUCKET = getConfig().storageBucket;

    export function getFileNameFromBlock(block: IBlock) {
        switch (block.content.type) {
            case 'image':
                return getFileNameFromStorageURL(block.content.src);
        }

        return undefined;
    }

    export function isCloudStorageURL(url: URLStr): boolean {
        return url.indexOf(STORAGE_BUCKET) > -1;
    }

    export function getFileNameFromStorageURL(url: URLStr): string | undefined {
        if (!isCloudStorageURL(url)) {
            return undefined;
        }
        const {pathname} = new URL(url);
        const pathnameParts = pathname.split('/');
        return pathnameParts[pathnameParts.length - 1];
    }

    export function handleBlockAdded(collection: ICollectionReference<unknown>,
                                     batch: IWriteBatch<unknown>,
                                     block: IBlock) {

        const addedFileName = FileTombstones.getFileNameFromBlock(block);

        if (addedFileName) {
            const identifier = Hashcodes.create(addedFileName);
            const doc = collection.doc(identifier);
            batch.delete(doc);
        }

    }

    export function handleBlockRemoved(collection: ICollectionReference<unknown>,
                                       batch: IWriteBatch<unknown>,
                                       block: IBlock) {

        const deletedFileName = FileTombstones.getFileNameFromBlock(block);

        if (deletedFileName) {
            const identifier = Hashcodes.create(deletedFileName);
            const doc = collection.doc(identifier);

            batch.set(doc, {
                created: ISODateTimeStrings.create(),
                uid: block.uid,
                filename: deletedFileName,
            });
        }

    }
}
