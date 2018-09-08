import {isPresent} from '../../../web/js/Preconditions';
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {Optional} from '../../../web/js/util/ts/Optional';
import {RepoDocInfo} from './RepoDocInfo';

export class RepoDocInfos {

    public static isValid(repoDocInfo: RepoDocInfo) {
        return isPresent(repoDocInfo.filename);
    }

    public static convertFromDocInfo(docInfo: IDocInfo): RepoDocInfo {

        return {

            fingerprint: docInfo.fingerprint,

            // TODO: we should map this to also filter out '' and ' '
            // from the list of strings.
            title: Optional.first(docInfo.title,
                                  docInfo.filename)
                .validateString()
                .getOrElse('Untitled'),

            progress: Optional.of(docInfo.progress)
                .validateNumber()
                .getOrElse(0),

            filename: Optional.of(docInfo.filename)
                .validateString()
                .getOrUndefined(),

            added: Optional.of(docInfo.added)
                .map(current => {

                    // this is a pragmatic workaround for JSON
                    // serialization issues with typescript.

                    if ( typeof current === 'object') {

                        // this is a bug fix/workaround for corrupt stores that
                        // accidentally had and ISODateTime stored in them.

                        const obj = <any> current;

                        if (isPresent(obj.value) && typeof obj.value === 'string') {
                            return obj.value;
                        }

                    }

                    return current;

                })
                .validateString()
                .getOrUndefined(),

            flagged: Optional.of(docInfo.flagged)
                .validateBoolean()
                .getOrElse(false),

            archived: Optional.of(docInfo.archived)
                .validateBoolean()
                .getOrElse(false),

            docInfo

        };

    }

}
