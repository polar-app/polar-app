import {TextHighlight} from '../../../web/js/metadata/TextHighlight';
import {AreaHighlight} from '../../../web/js/metadata/AreaHighlight';
import {DocInfo} from '../../../web/js/metadata/DocInfo';
import {RepoAnnotationInfo} from './RepoAnnotationInfo';
import {AnnotationType} from '../../../web/js/metadata/AnnotationType';

export class RepoAnnotationInfos {

    public static convert(from: TextHighlight | AreaHighlight,
                          type: AnnotationType,
                          docInfo: DocInfo): RepoAnnotationInfo {

        return {
            fingerprint: docInfo.fingerprint,
            text: "This is an example",
            type,
            created: from.created,
            tags: docInfo.tags || {},
            docInfo
        };

    }

}
