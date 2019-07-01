import {GroupIDStr} from "../../Datastore";
import {UserGroup, UserGroups} from "./UserGroups";
import {GroupDoc, GroupDocs} from "./GroupDocs";
import {DocMeta} from "../../../metadata/DocMeta";
import {SetArrays} from "../../../util/SetArrays";
import {PageMeta} from "../../../metadata/PageMeta";
import {Collections, DocumentChange} from "./Collections";
import {DocIDStr} from "../rpc/GroupProvisions";
import {DocMetaHolder, RecordHolder} from "../../FirebaseDatastore";

export class DocsListener {

    // FIXME: how do we behave when cloud sync isn't enable.

    // FIXME: this should be its own class with its own snapshot methods so that I can
    // call the snapshot methods directly for testing...

    public static listen(fingerprint: string,
                         docMetaHandler: (docMeta: DocMeta, groupDoc: GroupDoc) => void,
                         errHandler: (err: Error) => void) {

        // FIXME: only emit on the FIRST time we see the doc and then give the caller a
        // proxied object after that...

        const docMetaIndex: {[docID: string]: DocMeta} = {};

        const groupDocMonitors  = new Set<DocIDStr>();

        const handleDocMetaRecord = async (docMetaRecord: DocMetaRecord | undefined) => {

            // FIXME: listen to snapshots of this DocMeta and then perform the merger...

            if (! docMetaRecord) {
                // doc was removed
                return;
            }

            //
            // const getOrCreateDocMeta = () => {
            //
            //     if (docMetaIndex[docID]) {
            //         return docMetaIndex[docID];
            //     } else {
            //
            //     }
            //
            // };

        };

        const handleGroupDoc = async (groupDocChange: DocumentChange<GroupDoc>) => {

            // TODO: we technically need to keep track and unsubscribe when documents are
            // removed from the group.

            if (groupDocChange.type === 'removed') {
                // we only care about added or updated
                return;
            }

            const groupDoc = groupDocChange.value;

            const {docID} = groupDoc;

            if (! groupDocMonitors.has(docID)) {

                // start listening to snapshots on this docID
                await DocMetaRecords.onSnapshot(docID, record => {

                    handleDocMetaRecord(record)
                        .catch(err => errHandler(err));

                });

                groupDocMonitors.add(docID);

            }

        };

        const handleGroup = async (groupID: GroupIDStr) => {

            // FIXME this will load the initial documents but it will NOT
            // load deltas from the server which is the MAIN problem at the moment...

            // FIXME: we might have to refactor this to have it ALL be done in react
            // moving forward which would mean a huge amount of wasted time but worth
            // it for the long term.

            // FIXME: this is going to give us a dumop of ALL the documents in this snapshot
            // not just the changes..so we're goign to fetch EVERY time one updates... which is
            // NOT what we want...
            await GroupDocs.onSnapshotForByGroupIDAndFingerprint(groupID, fingerprint, groupDocs => {

                for (const groupDoc of groupDocs) {

                    handleGroupDoc(groupDoc)
                        .catch(err => errHandler(err));
                }

            });

        };

        const handleUserGroups = async () => {

            // the current groups being monitored
            const monitoring = new Set<GroupIDStr>();

            await UserGroups.onSnapshot(userGroups => {

                if (! userGroups) {
                    return;
                }

                for (const groupID of userGroups.groups) {

                    if (monitoring.has(groupID)) {
                        continue;
                    }

                    monitoring.add(groupID);

                    handleGroup(groupID)
                        .catch(err => errHandler(err));

                }

            });

        };

        handleUserGroups()
            .catch(err => errHandler(err));

    }

    /**
     * Start with the source and perform a diff against the target.
     *
     * @param source
     * @param target
     */
    public static mergeUpdate(source: DocMeta, target: DocMeta) {

        const mergePageMeta = (source: PageMeta, target: PageMeta) => {

            StringDicts.merge(source.textHighlights, target.textHighlights);
            StringDicts.merge(source.areaHighlights, target.areaHighlights);
            StringDicts.merge(source.notes, target.notes);
            StringDicts.merge(source.comments, target.comments);
            StringDicts.merge(source.questions, target.questions);
            StringDicts.merge(source.flashcards, target.flashcards);

        };

        for (const page of Object.keys(source.pageMetas)) {
            mergePageMeta(source.pageMetas[page], target.pageMetas[page]);
        }

    }


}

interface StringDict<T> {
    [key: string]: T;
}

class StringDicts {

    public static merge<T>(source: StringDict<T>, target: StringDict<T>) {

        // *** delete excess in the target that were deleted in the source

        const deletable = SetArrays.difference(Object.keys(target), Object.keys(source));

        for (const key of deletable) {
            delete target[key];
        }

        // FIXME: I think we have to update this to ALSO look at the GUID... and if when the GUID
        // is updated we also have to update that too.

        // *** copy new keys into the target
        const copyable = SetArrays.difference(Object.keys(source), Object.keys(target));

        for (const key of copyable) {
            target[key] = source[key];
        }

    }

}

class DocMetaRecords {

    public static readonly COLLECTION = 'doc_meta';

    public static async onSnapshot(id: DocMetaIDStr, handler: (record: DocMetaRecord | undefined) => void) {

        return await Collections.onDocumentSnapshot<DocMetaRecord>(this.COLLECTION,
                                                                   id,
                                                                   record => handler(record));


    }

}


export type DocMetaIDStr = string;

export type DocMetaRecord = RecordHolder<DocMetaHolder>;
