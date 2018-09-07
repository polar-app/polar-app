import {isPresent} from '../../../web/js/Preconditions';
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {Optional} from '../../../web/js/util/ts/Optional';
import {RepoDocInfo} from './RepoDocInfo';

export class RepoDocInfos {

    public static isValid(repoDocInfo: RepoDocInfo) {

        if (isPresent(repoDocInfo.filename)) {
            return true;
        } else {
            return false;
        }

    }

    public static convertFromDocInfo(docInfo: IDocInfo): RepoDocInfo {

        return {

            fingerprint: docInfo.fingerprint,

            // TODO: we should map this to also filter out '' and ' '
            // from the list of strings.
            title: Optional.first(docInfo.title,
                                  docInfo.filename)
                .getOrElse('Untitled'),

            progress: Optional.of(docInfo.progress)
                .getOrElse(0),

            filename: Optional.of(docInfo.filename)
                .getOrUndefined(),

            added: Optional.of(docInfo.added)
                .map(current => {

                    // this is a pragmatic workaround for JSON
                    // serialization issues with typescript.

                    if ( typeof current === 'string') {
                        return current;
                    }

                    return current.value;

                })
                .getOrUndefined(),

            flagged: Optional.of(docInfo.flagged).getOrElse(false),

            archived: Optional.of(docInfo.archived).getOrElse(false),

            docInfo

        };

    }

}
