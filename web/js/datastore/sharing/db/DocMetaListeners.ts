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
import {Author} from "../../../metadata/Author";
import {Annotation} from "../../../metadata/Annotation";
import {Logger} from "../../../logger/Logger";
import {UserProfile, UserProfiles} from "./UserProfiles";

const log = Logger.create();

export class DocMetaListener {

    private docMetaIndex: {[docID: string]: DocMeta} = {};

    private groupDocMonitors  = new Set<DocIDStr>();

    // the current groups being monitored
    private monitoredGroups = new Set<GroupIDStr>();

    public constructor(private readonly fingerprint: string,
                       private readonly profileID: ProfileIDStr,
                       private readonly docMetaHandler: (docMeta: DocMeta, docUpdateRef: DocUpdateRef) => void,
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

        if (! userGroup.groups) {
            log.warn("No user groups on object: ", userGroup);
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

        const {docID, fingerprint, profileID} = groupDoc;

        const userProfile = await UserProfiles.get(profileID);

        await this.handleDocMetaRecordWithUserProfile(groupDoc, userProfile, docMetaRecord);

    }

    public async handleDocMetaRecordWithUserProfile(docUpdateRef: DocUpdateRef,
                                                    userProfile: UserProfile,
                                                    docMetaRecord: DocMetaRecord | undefined) {

        // listen to snapshots of this DocMeta and then perform the merger...

        if (!docMetaRecord) {
            // doc was removed
            return;
        }

        const {docID, fingerprint} = docUpdateRef;

        const prev = Optional.of(this.docMetaIndex[docID]).getOrUndefined();

        const createDocMeta = () => {

            const result = DocMetas.deserialize(docMetaRecord.value.value, fingerprint);

            if (prev) {
                return result;
            }

            return Proxies.create(result);

        };

        const curr = createDocMeta();

        await DocMetaRecords.applyAuthorsFromUserProfile(curr, userProfile);

        if (prev) {
            // now merge the metadata so we get our events fired.
            DocMetaRecords.mergeDocMetaUpdate(curr, prev);
        } else {
            // only emit on the FIRST time we see the doc and then give the caller a
            // proxied object after that...
            this.docMetaHandler(curr, docUpdateRef);
            this.docMetaIndex[docID] = curr;
        }

    }

}

export class DocMetaListeners {

    public static async register(fingerprint: string,
                                 docMetaHandler: (docMeta: DocMeta, docUpdateRef: DocUpdateRef) => void,
                                 errHandler: (err: Error) => void) {

        const profileOwner = await ProfileOwners.get();

        if (! profileOwner) {
            throw new Error("No profile");
        }

        const {profileID} = profileOwner;

        new DocMetaListener(fingerprint, profileID, docMetaHandler, errHandler).start();

    }

}

interface StringDict<T> {
    [key: string]: T;
}

class StringDicts {

    public static merge<T>(source: StringDict<T>, target: StringDict<T>) {

        // *** delete excess in the target that were deleted in the source

        const deletable = SetArrays.difference(Object.keys(target), Object.keys(source));

        if  (deletable.length > 0) {
            console.log("FIXME: deleting ", deletable);
        }

        for (const key of deletable) {
            delete target[key];
        }

        // FIXME: I think we have to update this to ALSO look at the GUID... and if when the GUID
        // is updated we also have to update that too.
        //
        // I think the BEST way to do this would be to compute a key which is ID+guid (if guid is designed)...

        // *** copy new keys into the target
        const copyable = SetArrays.difference(Object.keys(source), Object.keys(target));

        if  (copyable.length > 0) {
            console.log("FIXME: copyable ", copyable);
        }

        for (const key of copyable) {
            target[key] = source[key];
        }

    }

}

export class DocMetaRecords {

    public static readonly COLLECTION = 'doc_meta';

    public static async onSnapshot(id: DocMetaIDStr, handler: (record: DocMetaRecord | undefined) => void) {

        return await Collections.onDocumentSnapshot<DocMetaRecord>(this.COLLECTION,
                                                                   id,
                                                                   record => handler(record));

    }

    /**
     * Start with the source and perform a diff against the target.
     */
    public static mergeDocMetaUpdate(source: DocMeta, target: DocMeta) {

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

    public static applyAuthorsFromUserProfile(docMeta: DocMeta, userProfile: UserProfile) {

        const {profile} = userProfile;

        const createAuthorFromProfile = () => {

            const profileID = profile.id;

            const name = profile!.name || profile!.handle || 'unknown';

            const createImage  = () => {
                if (profile.image) {
                    return {
                        src: profile!.image!.url
                    };
                }

                return undefined;

            };

            const image = createImage();

            return new Author({name, image, profileID, guest: ! userProfile.self});

        };

        const author = createAuthorFromProfile();

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

export interface DocUpdateRef {
    readonly docID: DocIDStr;
    readonly fingerprint: string;
}
