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
import {Proxies} from "../../../proxies/Proxies";
import {ProfileOwners} from "./ProfileOwners";
import {ProfileIDStr} from "./Profiles";
import {Firebase} from "../../../firebase/Firebase";
import {Preconditions} from "../../../Preconditions";
import {Author} from "../../../metadata/Author";
import {Annotation} from "../../../metadata/Annotation";

export class DocMetaListener {

    private docMetaIndex: {[docID: string]: DocMeta} = {};

    private groupDocMonitors  = new Set<DocIDStr>();

    // the current groups being monitored
    private monitoredGroups = new Set<GroupIDStr>();

    constructor(private readonly fingerprint: string,
                private readonly profileID: ProfileIDStr,
                private readonly author: Author,
                private readonly docMetaHandler: (docMeta: DocMeta, groupDoc: GroupDoc) => void,
                private readonly errHandler: (err: Error) => void) {

    }

    public start() {

        // TODO: exclude my OWN documents by getting my profile and excluding all the docs matching my profile.

        // TODO: we could have a stop method if we added support for keeping the
        // unsubscribe functions.

        const handleUserGroups = async () => {
            await UserGroups.onSnapshot(userGroup => this.onSnapshotForUserGroup(userGroup));
        };

        handleUserGroups()
            .catch(err => this.errHandler(err));

    }

    public onSnapshotForUserGroup(userGroup: UserGroup | undefined) {

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

    public async handleGroup(groupID: GroupIDStr) {

        await GroupDocs.onSnapshotForByGroupIDAndFingerprint(groupID,
                                                             this.fingerprint,
                                                             groupDocs => this.onSnapshotForGroupDocs(groupDocs));

    }

    public onSnapshotForGroupDocs(groupDocChanges: ReadonlyArray<DocumentChange<GroupDoc>>) {

        for (const groupDocChange of groupDocChanges) {

            this.handleGroupDoc(groupDocChange)
                .catch(err => this.errHandler(err));

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

        const {docID, profileID} = groupDoc;

        if (profileID === this.profileID) {
            // this is my OWN doc so sort of pointless to index it.
            return;
        }

        if (! this.groupDocMonitors.has(docID)) {

            // start listening to snapshots on this docID
            await DocMetaRecords.onSnapshot(docID,
                                            docMetaRecord => this.onSnapshotForDocMetaRecord(groupDoc, docMetaRecord));

            this.groupDocMonitors.add(docID);

        }

    }

    public onSnapshotForDocMetaRecord(groupDoc: GroupDoc,
                                      docMetaRecord: DocMetaRecord | undefined) {

        this.handleDocMetaRecord(groupDoc, docMetaRecord)
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

        const createDocMeta = () => {

            const result = DocMetas.deserialize(docMetaRecord.value.value, fingerprint);

            if (prev) {
                return result;
            }

            return Proxies.create(result);

        };

        const curr = createDocMeta();

        if (prev) {
            // now merge the metadata so we get our events fired.
            DocMetaRecords.updateDocMeta(curr, prev, this.author);
        } else {
            // only emit on the FIRST time we see the doc and then give the caller a
            // proxied object after that...
            this.docMetaHandler(curr, groupDoc);
        }

        // now update the index...
        this.docMetaIndex[docID] = curr;

    }


}

export class DocMetaListeners {

    public static async register(fingerprint: string,
                                 docMetaHandler: (docMeta: DocMeta, groupDoc: GroupDoc) => void,
                                 errHandler: (err: Error) => void) {

        const profileOwner = await ProfileOwners.get();

        if (! profileOwner) {
            throw new Error("No profile");
        }

        const {profileID} = profileOwner;

        const createAuthor = async () => {

            const user = await Firebase.currentUser();
            Preconditions.assertPresent(user, "user");

            return new Author({
                name: user!.displayName!,
                image: {
                    src: user!.photoURL!
                }
            });

        };

        const author = await createAuthor();

        new DocMetaListener(fingerprint, profileID, author, docMetaHandler, errHandler).start();

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
        //
        // I think the BEST way to do this would be to compute a key which is ID+guid (if guid is designed)...

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


    public static updateDocMeta(source: DocMeta,
                                target: DocMeta,
                                author: Author) {

        this.applyAuthor(source, author);
        this.mergeDocMetaUpdate(source, target);
    }

    /**
     * Start with the source and perform a diff against the target.
     */
    private static mergeDocMetaUpdate(source: DocMeta, target: DocMeta) {

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

    private static applyAuthor(docMeta: DocMeta, author: Author) {

        const applyAuthorToAnnotations = (dict: {[key: string]: Annotation}) => {

            for (const annotation of Object.values(dict)) {
                annotation.author = author;
            }

        };

        const applyAuthorToPage = (pageMeta: PageMeta) => {

            applyAuthorToAnnotations(pageMeta.textHighlights);
            applyAuthorToAnnotations(pageMeta.areaHighlights);
            applyAuthorToAnnotations(pageMeta.notes);
            applyAuthorToAnnotations(pageMeta.comments);
            applyAuthorToAnnotations(pageMeta.questions);
            applyAuthorToAnnotations(pageMeta.flashcards);

        };

        for (const page of Object.keys(docMeta.pageMetas)) {
            applyAuthorToPage(docMeta.pageMetas[page]);
        }

    }

}

export type DocMetaIDStr = string;

export type DocMetaRecord = RecordHolder<DocMetaHolder>;
