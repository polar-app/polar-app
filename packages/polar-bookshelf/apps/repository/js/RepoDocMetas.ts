import {RepoDocMeta} from './RepoDocMeta';
import {RepoDocInfos} from './RepoDocInfos';
import {RepoDocAnnotations} from './RepoDocAnnotations';
import {isPresent} from 'polar-shared/src/Preconditions';
import {PersistenceLayerProvider} from '../../../web/js/datastore/PersistenceLayer';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";


export class RepoDocMetas {

    public static isValid(repoDocMeta?: RepoDocMeta): RepoDocValidity {

        if (! repoDocMeta) {
            return 'no-value';
        }

        if (! isPresent(repoDocMeta.repoDocInfo.filename)) {
            return 'no-filename';
        }

        return 'valid';

    }

    public static convert(persistenceLayerProvider: PersistenceLayerProvider,
                          fingerprint: string,
                          fromCache: boolean,
                          hasPendingWrites: boolean,
                          docMeta?: IDocMeta): RepoDocMeta | undefined {

        if (! docMeta) {
            console.warn("No docMeta for file: ", fingerprint);
            return undefined;
        }

        if (! docMeta.docInfo) {
            console.warn("No docInfo for file: ", fingerprint);
            return undefined;
        }

        const repoDocInfo = RepoDocInfos.convert(docMeta, fromCache, hasPendingWrites);
        const repoAnnotations = RepoDocAnnotations.convert(persistenceLayerProvider, docMeta);

        return {repoDocInfo, repoDocAnnotations: repoAnnotations};

    }

}

export type RepoDocValidity = 'valid' | 'no-value' | 'no-filename';
