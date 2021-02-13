import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FirebaseDatastores} from "../../../datastore/FirebaseDatastores";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {DocIDStr, DocRef} from "polar-shared/src/groups/DocRef";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {ProfileIDStr, UserIDStr} from "../Profiles";
import {IDRecord} from "../Collections";
import {DocRefs} from "./DocRefs";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

export class BaseDocAnnotations {

    public static toDocAnnotations(uid: UserIDStr,
                                   profileID: ProfileIDStr | undefined,
                                   docMeta: IDocMeta | undefined,
                                   visibility: Visibility): ReadonlyArray<BaseDocAnnotation> {

        const result: BaseDocAnnotation[] = [];

        if (! docMeta) {
            // when there's no docMeta we have to return just an empty array since there's
            // nothing to convert
            return result;
        }

        const docID = FirebaseDatastores.computeDocMetaID(docMeta.docInfo.fingerprint, uid);

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            result.push(...this.convertAnnotations(docID, docMeta, visibility, AnnotationType.COMMENT, profileID, Object.values(pageMeta.comments)));
            result.push(...this.convertAnnotations(docID, docMeta, visibility, AnnotationType.FLASHCARD, profileID, Object.values(pageMeta.flashcards)));
            result.push(...this.convertAnnotations(docID, docMeta, visibility, AnnotationType.AREA_HIGHLIGHT, profileID, Object.values(pageMeta.areaHighlights)));
            result.push(...this.convertAnnotations(docID, docMeta, visibility, AnnotationType.TEXT_HIGHLIGHT, profileID, Object.values(pageMeta.textHighlights)));

        }

        return result;

    }

    private static convertAnnotations<T extends BaseAnnotationType>(docID: DocIDStr,
                                                                    docMeta: IDocMeta,
                                                                    visibility: Visibility,
                                                                    annotationType: AnnotationType,
                                                                    profileID: ProfileIDStr | undefined,
                                                                    values: ReadonlyArray<T>): ReadonlyArray<BaseDocAnnotation> {

        return values.map(current => this.convertAnnotation(docID, docMeta, visibility, annotationType, profileID, current));
    }

    private static convertAnnotation<T extends BaseAnnotationType>(docID: DocIDStr,
                                                                   docMeta: IDocMeta,
                                                                   visibility: Visibility,
                                                                   annotationType: AnnotationType,
                                                                   profileID: ProfileIDStr | undefined,
                                                                   original: T): BaseDocAnnotation {

        const docRef
            = Dictionaries.onlyDefinedProperties(DocRefs.convertFromDocInfo(docID, docMeta.docInfo));

        return {
            id: original.id,
            docID,
            fingerprint: docRef.fingerprint,
            docRef,
            annotationType,
            original,
            profileID,
            visibility,
            created: original.created,
            lastUpdated: original.lastUpdated
        };

    }

}


/**
 * Represent a denormalized
 */
export interface BaseDocAnnotation extends IDRecord {

    /**
     * The main ID of this annotations which can change over time.
     */
    readonly id: string;

    readonly docID: DocIDStr;

    readonly fingerprint: string;

    readonly docRef: DocRef;

    readonly annotationType: AnnotationType;

    readonly original: IComment | IFlashcard | IAreaHighlight | ITextHighlight;

    /**
     * The profile ID of this user which we need to resolve the profile information at runtime.  We should only
     * store the profileID NOT the full metadata denormalized as it changes independent of this record.
     */
    readonly profileID?: ProfileIDStr;

    readonly visibility: Visibility;

    readonly created: ISODateTimeString;

    readonly lastUpdated: ISODateTimeString;

}

type BaseAnnotationType = IComment | IFlashcard | IAreaHighlight | ITextHighlight;
