import {RepoDocMeta} from './RepoDocMeta';
import {RepoDocInfos} from './RepoDocInfos';
import {RepoDocAnnotations} from './RepoDocAnnotations';
import {Logger} from "polar-shared/src/logger/Logger";
import {isPresent} from 'polar-shared/src/Preconditions';
import {PersistenceLayerProvider} from '../../../web/js/datastore/PersistenceLayer';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

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
            log.warn("No docMeta for file: ", fingerprint);
            return undefined;
        }

        if (! docMeta.docInfo) {
            log.warn("No docInfo for file: ", fingerprint);
            return undefined;
        }

        const repoDocInfo = RepoDocInfos.convert(docMeta, fromCache, hasPendingWrites);
        const repoAnnotations = RepoDocAnnotations.convert(persistenceLayerProvider, docMeta);

        return {repoDocInfo, repoDocAnnotations: repoAnnotations};

    }

}

export type RepoDocValidity = 'valid' | 'no-value' | 'no-filename';
