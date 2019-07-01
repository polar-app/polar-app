import {GroupIDStr} from "../../Datastore";
import {UserGroup, UserGroups} from "./UserGroups";
import {GroupDoc, GroupDocs} from "./GroupDocs";
import {DocMeta} from "../../../metadata/DocMeta";
import {SetArrays} from "../../../util/SetArrays";
import {PageMeta} from "../../../metadata/PageMeta";
import {Collections, DocumentChange} from "./Collections";
import {DocIDStr} from "../rpc/GroupProvisions";
import {DocMetaHolder, RecordHolder} from "../../FirebaseDatastore";
import {DocMetas} from "../../../metadata/DocMetas";
import {Optional} from "../../../util/ts/Optional";

export class DocMetaListener {

    private docMetaIndex: {[docID: string]: DocMeta} = {};

    private groupDocMonitors  = new Set<DocIDStr>();

    // the current groups being monitored
    private monitoredGroups = new Set<GroupIDStr>();

    constructor(private readonly fingerprint: string,
                private readonly docMetaHandler: (docMeta: DocMeta, groupDoc: GroupDoc) => void,
                private readonly errHandler: (err: Error) => void) {

    }

    public start() {

        // TODO: we could have a stop method if we added support for keeping the
        // unsubscribe functions.

        const handleUserGroups = async () => {
            await UserGroups.onSnapshot(userGroup => this.onUserGroup(userGroup));
        };

        handleUserGroups()
            .catch(err => this.errHandler(err));

    }

    public async handleDocMetaRecord(groupDoc: GroupDoc,
                                     docMetaRecord: DocMetaRecord | undefined) {

        // listen to snapshots of this DocMeta and then perform the merger...

        if (!docMetaRecord) {
            // doc was removed
            return;
        }

        const {docID, fingerprint} = groupDoc;

        const prev = Optional.of(this.docMetaIndex[docID]).getOrUndefined();
        const curr = DocMetas.deserialize(docMetaRecord.value.value, fingerprint);

        if (prev) {
            // now merge the metadata so we get our events fired.
            this.mergeDocMetaUpdate(curr, prev);
        } else {
            // only emit on the FIRST time we see the doc and then give the caller a
            // proxied object after that...
            this.docMetaHandler(curr, groupDoc);
        }

    }

    public async handleGroupDoc(groupDocChange: DocumentChange<GroupDoc>) {

        // TODO: we technically need to keep track and unsubscribe when documents are
        // removed from the group.

        if (groupDocChange.type === 'removed') {
            // we only care about added or updated
            return;
        }

        const groupDoc = groupDocChange.value;

        const {docID} = groupDoc;

        if (! this.groupDocMonitors.has(docID)) {

            // start listening to snapshots on this docID
            await DocMetaRecords.onSnapshot(docID, record => {

                this.handleDocMetaRecord(groupDoc, record)
                    .catch(err => this.errHandler(err));

            });

            this.groupDocMonitors.add(docID);

        }

    }

    public async handleGroup(groupID: GroupIDStr) {

        await GroupDocs.onSnapshotForByGroupIDAndFingerprint(groupID, this.fingerprint, groupDocs => {

            // FIXME: make this a method so we can test it..

            for (const groupDoc of groupDocs) {

                this.handleGroupDoc(groupDoc)
                    .catch(err => this.errHandler(err));
            }

        });

    }

    public onUserGroup(userGroup: UserGroup | undefined) {

        if (! userGroup) {
            return;
        }

        for (const groupID of userGroup.groups) {

            if (this.monitoredGroups.has(groupID)) {
                continue;
            }

            this.monitoredGroups.add(groupID);

            this.handleGroup(groupID)
                .catch(err => this.errHandler(err));

        }

    }

    /**
     * Start with the source and perform a diff against the target.
     *
     */
    public mergeDocMetaUpdate(source: DocMeta, target: DocMeta) {

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

export class DocMetaListeners {

    public static register(fingerprint: string,
                           docMetaHandler: (docMeta: DocMeta, groupDoc: GroupDoc) => void,
                           errHandler: (err: Error) => void) {

        new DocMetaListener(fingerprint, docMetaHandler, errHandler).start();

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
