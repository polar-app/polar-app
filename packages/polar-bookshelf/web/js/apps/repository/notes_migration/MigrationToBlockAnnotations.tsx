import React from "react";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import {AdaptiveDialog} from "../../../mui/AdaptiveDialog";
import {useMigrationSnapshotByName} from "../UseMigrationSnapshot";
import {useFirestore} from "../../../../../apps/repository/js/FirestoreProvider";
import {RecordHolder} from "polar-shared/src/metadata/RecordHolder";
import {IQueryDocumentSnapshot} from "polar-firestore-like/src/IQueryDocumentSnapshot";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";
import {JSONRPC, JSONRPCError} from "../../../datastore/sharing/rpc/JSONRPC";
import {useStateRef} from "../../../hooks/ReactHooks";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {MigrationToBlockAnnotationsDialog} from "./MigrationToBlockAnnotationsDialog";
import {Percentages} from "polar-shared/src/util/Percentages";
import {ErrorType} from "../../../ui/data_loader/UseSnapshotSubscriber";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Analytics} from "../../../analytics/Analytics";
import {IFirestoreTypedQuerySnapshot} from "polar-firestore-like/src/FirestoreSnapshots";
import {useBlocksStore} from "../../../notes/store/BlocksStore";
import {useUserTagsDB} from "../../../../../apps/repository/js/persistence_layer/UserTagsDataLoader";
import {Tag} from "polar-shared/src/tags/Tags";
import {Contents} from "../../../notes/content/Contents";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IBlocksStore} from "../../../notes/store/IBlocksStore";
import {NameContent} from "../../../notes/content/NameContent";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {INameContent} from "polar-blocks/src/blocks/content/INameContent";
import {IBlockContentStructure, UIDStr} from "polar-blocks/src/blocks/IBlock";
import {NotesIntegrationContext} from "../../../notes/NoteUtils";

export const MIGRATION_TO_BLOCK_ANNOTATIONS_NAME = 'block-annotations';
const TAGS_MIGRATION_NAME = 'block-usertagsdb';
const MIGRATION_FUNCTION_PATH = 'MigrationToBlockAnnotations';
const ANALYTICS_MIGRATION_EVENT_PREFIX = 'migration-to-block-annotations';
const ANALYTICS_TAGS_MIGRATION_EVENT_PREFIX = 'user-tags-migration';

type ProgressData = {
    readonly total: number;
    readonly current: number;
    readonly started: ISODateTimeString;
};

namespace MigrationToBlockAnnotationsHelpers {

    export interface IDocMetaMigrationSnapshot {
        readonly migrations: ReadonlyArray<IDocMetaMigration>;
        readonly fromCache: boolean;
    }

    export interface IDocMetaMigration {
        readonly id: string;
        readonly migrated: boolean;
    }

    export type DocMetaMigrationSnapshotResult = readonly [IDocMetaMigrationSnapshot | undefined, ErrorType | undefined, SnapshotUnsubscriber];

    export function useDocMetaMigrationSnapshot(): DocMetaMigrationSnapshotResult {

        const {firestore, uid} = useFirestore();

        const [snapshot, setSnapshot] = React.useState<IDocMetaMigrationSnapshot | undefined>(undefined);
        const [error, setError] = React.useState<ErrorType | undefined>(undefined);

        const unsubscriberRef = React.useRef<SnapshotUnsubscriber>(NULL_FUNCTION);

        if (! uid) {
            throw new Error("Not authenticated");
        }

        const onNext = React.useCallback((snapshot: IQuerySnapshot<ISnapshotMetadata>) => {

            const fromCache = snapshot.metadata.fromCache;

            const toHolder = (snapshot: IQueryDocumentSnapshot<unknown>): RecordHolder<DocMetaHolder> =>
                snapshot.data() as RecordHolder<DocMetaHolder>;

            const migrations = snapshot.docs.map(toHolder).map(current => {
                return {
                    id: current.id,
                    migrated: current.value.ver === 3,
                };
            });

            setSnapshot({ fromCache, migrations });

        }, [setSnapshot]);

        const onError = React.useCallback((err: ErrorType) => {
            setError(err);
        }, [setError]);

        React.useEffect(() => {

            unsubscriberRef.current = firestore
                .collection('doc_meta')
                .where('uid', '==', uid)
                .onSnapshot({ includeMetadataChanges: true }, snapshot => onNext(snapshot), err => onError(err));

            return () => {
                unsubscriberRef.current();
            };

        }, [onNext, onError, firestore, uid])

        return [snapshot, error, unsubscriberRef.current];

    }

    export function useDocMetaMigrationSnapshotFromServer(): readonly [IDocMetaMigrationSnapshot | undefined, ErrorType | undefined] {

        const [serverSnapshot, setServerSnapshot] = React.useState<IDocMetaMigrationSnapshot | undefined>(undefined);
        const [snapshot, error, unsubscriber] = useDocMetaMigrationSnapshot();

        React.useEffect(() => {

            if (snapshot && ! snapshot.fromCache) {
                setServerSnapshot(snapshot);
                // now unsubscribe from updates as we have the first snapshot from the server.
                unsubscriber();
            }

        }, [setServerSnapshot, unsubscriber, snapshot])

        return [serverSnapshot, error];

    }

    /**
     * Migrate a doc_meta record by ID.
     *
     * @param id The id of the doc_meta record to be migrated.
     */
    export async function migrateDocMeta(id: string): Promise<void> {
        await JSONRPC.exec(MIGRATION_FUNCTION_PATH, { docMetaID: id });
    }

    export async function writeMigrationStarted(firestore: IFirestoreClient,
                                                uid: UIDStr,
                                                startTs: ISODateTimeString): Promise<void> {

        return MigrationCollection.write(firestore, {
            uid: uid,
            name: MIGRATION_TO_BLOCK_ANNOTATIONS_NAME,
            status: 'started',
            started: startTs,
        });

    }

    export async function writeMigrationCompleted(firestore: IFirestoreClient,
                                                  uid: UIDStr,
                                                  startTs: ISODateTimeString,
                                                  completeTs: ISODateTimeString): Promise<void> {

        return MigrationCollection.write(firestore, {
            uid: uid,
            name: MIGRATION_TO_BLOCK_ANNOTATIONS_NAME,
            status: 'completed',
            started: startTs,
            completed: completeTs,
        });
    }

    export async function writeMigrationFailed(firestore: IFirestoreClient,
                                               uid: UIDStr,
                                               startTs: ISODateTimeString,
                                               failTs: ISODateTimeString): Promise<void> {

        return MigrationCollection.write(firestore, {
            uid: uid,
            name: MIGRATION_TO_BLOCK_ANNOTATIONS_NAME,
            status: 'failed',
            started: startTs,
            failed: failTs,
        });
    }
}

function useMigrationExecutor() {
    const { firestore, user } = useFirestore();
    const [progressData, setProgressData, progressDataRef] = useStateRef<ProgressData | null>(null);
    const [error, setError] = React.useState<Error | null>(null);

    /**
     * Migrate the logged in user's data to the new blocks system.
     */
    const migrateData = React.useCallback(async (docMetas: MigrationToBlockAnnotationsHelpers.IDocMetaMigrationSnapshot) => {
        if (progressDataRef.current) { // The migration has already been started. just skip
            return;
        }

        if (! user) {
            throw new Error('useMigratorExecutor: user not found');
        }

        Analytics.event2(`${ANALYTICS_MIGRATION_EVENT_PREFIX}-started`);

        const started = ISODateTimeStrings.create();
        const total = docMetas.migrations.length;
        const unmigratedDocMetas = docMetas.migrations.filter(({ migrated }) => ! migrated);

        setProgressData({
            total,
            started,
            current: total - unmigratedDocMetas.length,
        });

        await MigrationToBlockAnnotationsHelpers
            .writeMigrationStarted(firestore, user.uid, started);

        let failCount = 0;

        for (const { id } of unmigratedDocMetas) {
            try {
                await MigrationToBlockAnnotationsHelpers.migrateDocMeta(id);
            } catch (e) {
                if (e instanceof JSONRPCError) {
                    console.log(`Migration of doc_meta with the id: ${id} has failed`, e);
                    failCount += 1;
                } else {


                    // Network error I think
                    throw e;
                }
            }

            setProgressData(({
                total,
                started,
                current: progressDataRef.current!.current + 1,
            }));

        }

        Analytics.event2(`${ANALYTICS_MIGRATION_EVENT_PREFIX}-finished`, { noSucceeded: unmigratedDocMetas.length - failCount, noFailed: failCount });

        await MigrationToBlockAnnotationsHelpers
            .writeMigrationCompleted(firestore, user.uid, started, ISODateTimeStrings.create());

    }, [setProgressData, progressDataRef, firestore, user]);

    /**
     * Start the migration process
     */
    const migrationExecutor = React.useCallback((docMetas: MigrationToBlockAnnotationsHelpers.IDocMetaMigrationSnapshot) => {
        migrateData(docMetas)
            .catch((err) => {
                if (! user) {
                    return console.error('useMigratorExecutor: user not found');
                }

                console.error('MigrationToBlockAnnotations failed with error', err);
                Analytics.event2(`${ANALYTICS_MIGRATION_EVENT_PREFIX}-failed`);
                setError(err);

                const started = progressDataRef.current!.started;

                MigrationToBlockAnnotationsHelpers
                    .writeMigrationFailed(firestore, user.uid, started, ISODateTimeStrings.create())
                    .catch(console.error);

            });
    }, [migrateData, setError, user, firestore, progressDataRef]);

    return { progressData, error, migrationExecutor };
}

namespace UserTagsMigrationHelpers {

    export function getBlockStructureTagsRecursively({ content, children }: IBlockContentStructure): ReadonlyArray<Tag> {
        const tags = Contents.create(content).getTags();

        return [...tags, ...children.flatMap(getBlockStructureTagsRecursively)];
    }

    export function getFromBlockStructures(blockStructures: ReadonlyArray<IBlockContentStructure>): ReadonlyArray<Tag> {

        return arrayStream(blockStructures.flatMap(getBlockStructureTagsRecursively))
            .unique(({ id }) => id)
            .collect();
    }

    export function userTagsToNotesTags(blocksStore: IBlocksStore,
                                        tags: ReadonlyArray<Tag>): ReadonlyArray<Tag> {

        const nonExistent = tags.filter(({ label }) => ! blocksStore.getBlockByName(label));

        const nonExistentBlockContents = nonExistent.map(({ label }) => 
            new NameContent({ type: 'name', data: label, links: [] }).toJSON());

        const nonExistentBlockStructures: ReadonlyArray<IBlockContentStructure<INameContent>> =
            nonExistentBlockContents.map(content => ({ id: Hashcodes.createRandomID(), content, children: [] }));

        if (nonExistentBlockStructures.length > 0) {
            blocksStore.insertFromBlockContentStructure(nonExistentBlockStructures);
        }

        // Tags that already exist as notes
        const existentBlockTags = tags.filter(({ id }) => !! blocksStore.index[id]);

        // Tags that we just created notes for
        const nonExistentBlockTags = nonExistentBlockStructures.map(({ id, content }) =>
            ({ id, label: content.data }))

        return [
            ...existentBlockTags,
            ...nonExistentBlockTags,
        ];

    }
}

function useTagsMigrationExecutor() {
    const blocksStore = useBlocksStore();
    const userTagsDB = useUserTagsDB();
    const [error, setError] = React.useState<Error | null>(null);
    const startedRef = React.useRef(false);
    const { firestore, user } = useFirestore();

    const migrationExecutor = React.useCallback(() => {
        if (startedRef.current || ! user) {
            return;
        }

        startedRef.current = true;
        const startTs = ISODateTimeStrings.create();

        const migrateData = async () => {
            await MigrationCollection.write(firestore, {
                uid: user.uid,
                name: TAGS_MIGRATION_NAME,
                status: 'started',
                started: startTs,
            });

            Analytics.event2(`${ANALYTICS_TAGS_MIGRATION_EVENT_PREFIX}-started`);

            const documentBlockIDs = Object.values(blocksStore.indexByDocumentID);
            const documentBlockStructures = blocksStore.createBlockContentStructure(documentBlockIDs);

            const blockTags = UserTagsMigrationHelpers.getFromBlockStructures(documentBlockStructures);
            const userTags = userTagsDB.tags();

            const tags = [...blockTags, ...UserTagsMigrationHelpers.userTagsToNotesTags(blocksStore, userTags)];

            const uniqueTags = arrayStream(tags).unique(({ id }) => id).collect();
            
            // Delete the old tags
            userTags.forEach(({ id }) => userTagsDB.delete(id));

            // Insert the new ones
            uniqueTags.forEach(tag => userTagsDB.register(tag));

            // Commit 💩
            await userTagsDB.commit();

            await MigrationCollection.write(firestore, {
                uid: user.uid,
                name: TAGS_MIGRATION_NAME,
                status: 'completed',
                started: startTs,
                completed: ISODateTimeStrings.create(),
            });

            Analytics.event2(`${ANALYTICS_TAGS_MIGRATION_EVENT_PREFIX}-completed`);
        };

        migrateData().catch((err) => {
            setError(err);

            if (! user) {
                return console.error('useMigratorExecutor: user not found');
            }

            console.error('MigrationToBlockAnnotations failed with error', err);
            Analytics.event2(`${ANALYTICS_TAGS_MIGRATION_EVENT_PREFIX}-failed`);

            MigrationCollection.write(firestore, {
                uid: user.uid,
                name: TAGS_MIGRATION_NAME,
                status: 'failed',
                started: startTs,
                failed: ISODateTimeStrings.create(),
            }).catch(console.error);
        });
        
    }, [blocksStore, userTagsDB, firestore, user, setError, startedRef]);

    return { migrationExecutor, error };
}

type IMigrationStatus = 'notstarted' | 'started' | 'completed' | undefined;

export const getMigrationStatusFromSnapshot = (migrationSnapshot: IFirestoreTypedQuerySnapshot<MigrationCollection.IMigration> | undefined): IMigrationStatus => {
    if (! migrationSnapshot) {
        return undefined;
    }

    if (migrationSnapshot.docs.length === 0) {
        return 'notstarted';
    }

    if (migrationSnapshot.docs[0].status === 'completed') {
        return 'completed';
    }

    return 'started';
};

interface IProps {
    readonly docMetaMigrationStatus: IMigrationStatus;
    readonly tagsMigrationStatus: IMigrationStatus;
}

export const MigrationToBlockAnnotationsRenderer: React.FC<IProps> = React.memo((props) => {
    const { docMetaMigrationStatus, tagsMigrationStatus } = props;

    const { progressData, error: migrationError, migrationExecutor } = useMigrationExecutor();
    const { migrationExecutor: tagsMigrationExecutor, error: tagsMigrationError } = useTagsMigrationExecutor();
    const [docMetaSnapshot, docMetasSnapshotError] = MigrationToBlockAnnotationsHelpers.useDocMetaMigrationSnapshotFromServer();

    /**
     * If the migration was started but not finished
     * then just resume it
     */
    React.useEffect(() => {

        if (docMetaSnapshot && 
            (docMetaMigrationStatus === 'started' || docMetaMigrationStatus === 'notstarted')) {
            migrationExecutor(docMetaSnapshot);
        }

    }, [docMetaMigrationStatus, docMetaSnapshot, migrationExecutor]);

    /**
     * Start the tag migration once the main migration is complete
     */
    React.useEffect(() => {

        if (docMetaMigrationStatus === 'completed'
            && (tagsMigrationStatus === 'notstarted' || tagsMigrationStatus === 'started')) {
            setTimeout(() => tagsMigrationExecutor(), 4000);
        }
    }, [tagsMigrationExecutor, docMetaMigrationStatus, tagsMigrationStatus]);

    const percentage = React.useMemo(() => {

        if (tagsMigrationStatus === 'started' || ! progressData) {
            return undefined;
        }
        
        return Percentages.calculate(progressData.current, progressData.total);

    }, [progressData, tagsMigrationStatus]);

    const genericError = migrationError || tagsMigrationError;

    if (genericError) {
        return (
            <Alert severity="error">
                We're unable to migrate your data: <q>{genericError.message}</q>
            </Alert>
        );
    }

    if (docMetasSnapshotError) {
        return (
            <Alert severity="error">
                We were unable to fetch the required data to perform the migration, Please try again later.
                {docMetasSnapshotError && (
                    <>
                        <br/>
                        {(docMetasSnapshotError as Error).message}
                    </>
                )}
            </Alert>
        );
    }

    return (
        <AdaptiveDialog>
            <MigrationToBlockAnnotationsDialog
                progress={percentage}
                started
            />
        </AdaptiveDialog>
    );
});

export const MigrationToBlockAnnotations: React.FC = React.memo((props) => {
    const [docMetaMigrationSnapshot, docMetaMigrationSnapshotError] = useMigrationSnapshotByName(MIGRATION_TO_BLOCK_ANNOTATIONS_NAME);
    const [tagsMigrationSnapshot, tagsMigrationSnapshotError] = useMigrationSnapshotByName(TAGS_MIGRATION_NAME);

    const docMetaMigrationStatus = React.useMemo(() => getMigrationStatusFromSnapshot(docMetaMigrationSnapshot), [docMetaMigrationSnapshot]);
    const tagsMigrationStatus = React.useMemo(() => getMigrationStatusFromSnapshot(tagsMigrationSnapshot), [tagsMigrationSnapshot]);

    const [skipped, setSkipped] = React.useState<boolean>(false);
    const [started, setStarted] = React.useState<boolean>(false);

    const handleSkip = React.useCallback(() => setSkipped(true), [setSkipped]);
    const handleStart = React.useCallback(() => setStarted(true), [setStarted]);

    const isDone = docMetaMigrationStatus === 'completed' && tagsMigrationStatus === 'completed';

    if (! docMetaMigrationSnapshot || ! tagsMigrationSnapshot) {
        return <LinearProgress />;
    }

    if (skipped || isDone) {
        return <NotesIntegrationContext.Provider value={isDone} children={props.children} />
    }

    const error = docMetaMigrationSnapshotError || tagsMigrationSnapshotError;

    if (error) {
        return (
            <Alert severity="error">
                We're unable to migrate your data: <q>{error.message}</q>
            </Alert>
        );
    }
    
    /**
     * Here we start the migration in the following two cases
     * 1. The user has explicity started the migration.
     * 2. The migration was started & failed or never finished
     */
    if (started || docMetaMigrationStatus === 'started' || tagsMigrationStatus === 'started') {
        return (
            <MigrationToBlockAnnotationsRenderer
                docMetaMigrationStatus={docMetaMigrationStatus}
                tagsMigrationStatus={tagsMigrationStatus}
            />
        );
    }

    return (
        <AdaptiveDialog>
            <MigrationToBlockAnnotationsDialog
                onSkip={handleSkip}
                onStart={handleStart}
                skippable
            />
        </AdaptiveDialog>
    );
});
