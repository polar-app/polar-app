import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {RepoDocInfo} from './RepoDocInfo';
import {DocInfos} from '../../../web/js/metadata/DocInfos';
import {Tag} from "polar-shared/src/tags/Tags";
import {SortFunctions} from "./doc_repo/util/SortFunctions";
import {Objects} from "polar-shared/src/util/Objects";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class RepoDocInfos {

    public static isValid(repoDocInfo: RepoDocInfo) {
        return isPresent(repoDocInfo.filename);
    }

    public static convert(docMeta: IDocMeta,
                          fromCache: boolean,
                          hasPendingWrites: boolean): RepoDocInfo {

        Preconditions.assertPresent(docMeta, "docMeta");

        const docInfo = docMeta.docInfo;

        return {

            id: docInfo.fingerprint,
            fingerprint: docInfo.fingerprint,

            // TODO: we should map this to also filter out '' and ' '
            // from the list of strings.
            title: DocInfos.bestTitle(docInfo),

            progress: Optional.of(docInfo.progress)
                .validateNumber()
                .getOrElse(0),

            filename: Optional.of(docInfo.filename)
                .validateString()
                .getOrUndefined(),

            added: Optional.of(docInfo.added)
                .map(current => this.toISODateTimeString(current))
                .validateString()
                .getOrUndefined(),

            lastUpdated: Optional.of(docInfo.lastUpdated)
                .map(current => this.toISODateTimeString(current))
                .validateString()
                .getOrUndefined(),

            flagged: Optional.of(docInfo.flagged)
                .validateBoolean()
                .getOrElse(false),

            archived: Optional.of(docInfo.archived)
                .validateBoolean()
                .getOrElse(false),

            tags: docInfo.tags || {},

            site: Optional.of(docInfo.url)
                .map(url => new URL(url).hostname)
                .getOrUndefined(),

            url: docInfo.url,

            nrAnnotations: Optional.of(docInfo.nrAnnotations)
                .getOrElse(0),

            hashcode: docInfo.hashcode,

            docInfo,
            docMeta,
            fromCache,
            hasPendingWrites

        };

    }

    private static toISODateTimeString(current: string) {


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

    }

    public static toTags(repoDocInfo?: RepoDocInfo): Tag[] {

        if (repoDocInfo) {
            return Object.values(repoDocInfo.tags || {});
        }

        return [];

    }

    /**
     * Sort doc infos and handle ties by using the added field.
     */
    public static sort(a: RepoDocInfo, b: RepoDocInfo, formatRecord: (repoDocInfo: RepoDocInfo) => string) {

        const cmp = SortFunctions.compareWithEmptyStringsLast(a, b, formatRecord);

        if (cmp !== 0) {
            return cmp;
        }

        // for ties use the date added...
        return Objects.toObjectSTR(a.added).localeCompare(Objects.toObjectSTR(b.added));

    }

}
