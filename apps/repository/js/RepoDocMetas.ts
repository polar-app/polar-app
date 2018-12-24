import {DocMeta} from "../../../web/js/metadata/DocMeta";
import {RepoDocMeta} from './RepoDocMeta';
import {RepoDocInfos} from './RepoDocInfos';
import {RepoAnnotations} from './RepoAnnotations';

export class RepoDocMetas {

    public static convert(docMeta: DocMeta): RepoDocMeta {

        const repoDocInfo = RepoDocInfos.convert(docMeta.docInfo);
        const repoAnnotations = RepoAnnotations.convert(docMeta);

        return {repoDocInfo, repoAnnotations};

    }
}

