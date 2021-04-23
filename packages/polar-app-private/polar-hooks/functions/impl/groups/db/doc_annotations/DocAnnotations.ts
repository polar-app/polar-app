import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {ProfileDocAnnotation, ProfileDocAnnotations} from "./ProfileDocAnnotation";
import {GroupDocAnnotation, GroupDocAnnotations} from "./GroupDocAnnotations";
import {defaultUserProfileProvider, ProfileIDStr, UserIDStr, UserProfileProvider} from "../Profiles";
import {BaseDocAnnotation, BaseDocAnnotations} from "./BaseDocAnnotations";
import {IDRecord, IDRecordMutations} from "../mutations/IDRecordMutations";
import {GroupIDStr} from "../Groups";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {IDStr} from "polar-shared/src/util/Strings";
import {UserID} from "../../../../sandbox/test";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export class DocAnnotations {

    public static async computeDocAnnotationMutations(before: IDocumentSnapshot,
                                                      after: IDocumentSnapshot,
                                                      userProfileProvider: UserProfileProvider = defaultUserProfileProvider): Promise<ReadonlyArray<DocAnnotationMutation>> {

        const toDocMetaRecordHolder = (documentSnapshot: IDocumentSnapshot): RecordHolder<DocMetaHolder> | undefined => {

            if (! documentSnapshot.exists) {
                return undefined;
            }

            return <RecordHolder<DocMetaHolder>> documentSnapshot.data();

        };

        const toDocMeta = (docMetaRecordHolder?: RecordHolder<DocMetaHolder>): IDocMeta | undefined => {

            if (! docMetaRecordHolder) {
                return undefined;
            }

            return JSON.parse(docMetaRecordHolder.value.value);

        };

        const computeUserIDFromRecordHolder = (documentSnapshot: IDocumentSnapshot) => {

            const recordHolder = toDocMetaRecordHolder(documentSnapshot);

            if (! recordHolder) {
                return undefined;
            }

            return recordHolder.uid;

        };

        const computeUserID = (): UserIDStr => {

            if (before.exists) {
                return (computeUserIDFromRecordHolder(before))!;
            }

            if (after.exists) {
                return (computeUserIDFromRecordHolder(after))!;
            }

            throw new Error("No user");

        };


        interface DocAnnotationRecord extends IDRecord {
            readonly id: IDStr;
            readonly collection: DocAnnotationCollection;
            readonly value: ProfileDocAnnotation | GroupDocAnnotation;
        }

        const toDocAnnotationRecord = (collection: DocAnnotationCollection,
                                       value: ProfileDocAnnotation | GroupDocAnnotation): DocAnnotationRecord => {
            return {
                id: value.id,
                created: value.created,
                lastUpdated: value.lastUpdated,
                collection,
                value
            };

        };

        const toGroups = (doc: DocRepresentation): ReadonlyArray<GroupIDStr> => {

            const {docMetaRecordHolder} = doc;

            if (! docMetaRecordHolder) {
                return [];
            }

            return docMetaRecordHolder.groups || [];

        };

        /**
         * Compute the records from the DocMeta that should be present so we can later diff them and compute the final
         * batch mutations to apply on Firebase.
         */
        const computeDocAnnotationRecords = (docRepresentation: DocRepresentation): ReadonlyArray<DocAnnotationRecord> => {

            const result: DocAnnotationRecord[] = [];

            const {docMetaRecordHolder, docMeta, baseDocAnnotations} = docRepresentation;

            if (! docMeta || ! docMetaRecordHolder) {
                // there's no docMeta previously so return nothing since nothing was written.
                return result;
            }

            const groups = toGroups(docRepresentation);

            for (const baseDocAnnotation of baseDocAnnotations) {

                if (profileID && docMetaRecordHolder.visibility === Visibility.PUBLIC) {

                    result.push(toDocAnnotationRecord('profile_doc_annotation',
                                                      ProfileDocAnnotations.convert(profileID, baseDocAnnotation)));

                }

                for (const groupID of groups) {

                    result.push(toDocAnnotationRecord('group_doc_annotation',
                                                      GroupDocAnnotations.convert(groupID, baseDocAnnotation)));

                }

            }

            return result;

        };

        interface DocRepresentation {
            readonly docMetaRecordHolder?: RecordHolder<DocMetaHolder>;
            readonly docMeta?: IDocMeta;
            readonly baseDocAnnotations: ReadonlyArray<BaseDocAnnotation>;
        }

        const toDocRepresentation = async (documentSnapshot: IDocumentSnapshot): Promise<DocRepresentation> => {

            const docMetaRecordHolder = toDocMetaRecordHolder(documentSnapshot);
            const docMeta = toDocMeta(docMetaRecordHolder);

            const visibility = docMetaRecordHolder ? docMetaRecordHolder.visibility : Visibility.PRIVATE;

            const baseDocAnnotations = await BaseDocAnnotations.toDocAnnotations(uid, profileID, docMeta, visibility);

            return {
                docMetaRecordHolder,
                docMeta,
                baseDocAnnotations
            };

        };

        interface DocRepresentationRecords extends DocRepresentation {
            readonly docAnnotationRecords: ReadonlyArray<DocAnnotationRecord>;
        }

        const toDocRepresentationRecords = async (documentSnapshot: IDocumentSnapshot): Promise<DocRepresentationRecords> => {

            const docRepresentation = await toDocRepresentation(documentSnapshot);
            const  docAnnotationRecords = await computeDocAnnotationRecords(docRepresentation);
            return {...docRepresentation, docAnnotationRecords};

        };

        const uid = computeUserID();
        const profile = await userProfileProvider(uid);
        const profileID: ProfileIDStr | undefined = profile ? profile.id : undefined;

        const prev = await toDocRepresentationRecords(before);
        const curr = await toDocRepresentationRecords(after);

        const recordMutations = IDRecordMutations.mutations(prev.docAnnotationRecords, curr.docAnnotationRecords);

        const result: DocAnnotationMutation[] = [];

        // *** now diff the two states and compute a set of changes which constructs the proper resulting state
        for (const recordMutation of recordMutations) {

            if (recordMutation.prev && ! recordMutation.curr) {

                result.push({
                    collection: recordMutation.prev.collection,
                    type: 'delete',
                    value: recordMutation.prev.value
                });

            }

            if (recordMutation.curr && (! recordMutation.prev || recordMutation.hasMutated)) {

                result.push({
                    collection: recordMutation.curr.collection,
                    type: 'set',
                    value: recordMutation.curr.value
                });

            }

        }

        return result;

    }

}

export type MutationType = 'set' | 'delete';

export type DocAnnotationCollection = 'profile_doc_annotation' |  'group_doc_annotation';

export interface DocAnnotationMutation {

    readonly collection: DocAnnotationCollection;
    readonly type: MutationType;
    readonly value: ProfileDocAnnotation | GroupDocAnnotation;

}


export interface RecordPermission {

    // the visibility of this record.
    readonly visibility: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr> | null;

}
/**
 * Holds a data object literal by value. This contains the high level
 * information about a document including the ID and the visibility.  The value
 * object points to a more specific object which hold the actual data we need.
 */
export interface RecordHolder<T> extends RecordPermission {

    // the owner of this record.
    readonly uid: UserID;

    readonly id: string;

    readonly value: T;

}

export class DocMetaHolders {

    public static create(docMeta: IDocMeta) {

        return {
            docInfo: docMeta.docInfo,
            value: JSON.stringify(docMeta)
        };

    }

}

export interface DocMetaHolder {

    // expose the high level DocInfo on this object which allows us to search by
    // URL, tags, etc.
    readonly docInfo: IDocInfo;

    readonly value: string;

}

export class IDocumentSnapshots {

    public static create(data?: IDocumentData): IDocumentSnapshot {

        const exists = data !== undefined;
        const dataFunction = () => data;
        return {exists, data: dataFunction};

    }

}

export interface IDocumentSnapshot {

    readonly exists: boolean;

    data(): IDocumentData | undefined;

}

// tslint:disable-next-line:interface-over-type-literal
export type IDocumentData = {[field: string]: any};

