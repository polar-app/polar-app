import React from "react";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import {AdaptiveDialog} from "../../mui/AdaptiveDialog";
import {useMigrationSnapshotByName} from "./UseMigrationSnapshot";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {RecordHolder} from "polar-shared/src/metadata/RecordHolder";
import {IQueryDocumentSnapshot} from "polar-firestore-like/src/IQueryDocumentSnapshot";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";
import {JSONRPC} from "../../datastore/sharing/rpc/JSONRPC";
import {useStateRef} from "../../hooks/ReactHooks";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {UIDStr} from "polar-blocks/src/blocks/IBlock";
import {MigrationToBlockAnnotationsMain} from "./MigrationToBlockAnnotationsMain";
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";
import {Percentages} from "polar-shared/src/util/Percentages";
import {ErrorType} from "../../ui/data_loader/UseSnapshotSubscriber";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly children: JSX.Element;
}

const MIGRATION_FUNCTION_PATH = 'MigrationToBlockAnnotations';
const MIGRATION_NAME = 'block-annotations';

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

    export type DocMetaMigrationSnapshotResult = Readonly<[IDocMetaMigrationSnapshot | undefined, ErrorType | undefined, SnapshotUnsubscriber]>;

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
                    migrated: current.value.ver === 3
                }
            })

            setSnapshot({fromCache, migrations});

        }, []);

        const onError = React.useCallback((err: ErrorType) => {
            setError(err);
        }, []);

        React.useEffect(() => {

            unsubscriberRef.current = firestore
                .collection('doc_meta')
                .where('uid', '==', uid)
                .onSnapshot(snapshot => onNext(snapshot), err => onError(err))

            return () => {
                unsubscriberRef.current();
            }

        }, [])

        return [snapshot, error, unsubscriberRef.current];

    }

    export function useDocMetaMigrationSnapshotFromServer(): Readonly<[IDocMetaMigrationSnapshot | undefined, ErrorType | undefined]> {

        const [serverSnapshot, setServerSnapshot] = React.useState<IDocMetaMigrationSnapshot | undefined>(undefined);
        const [snapshot, error, unsubscriber] = useDocMetaMigrationSnapshot();

        React.useEffect(() => {

            if (! snapshot?.fromCache) {
                setServerSnapshot(serverSnapshot);
                // now unsubscribe from updates as we have the first snapshot from the server.
                unsubscriber();
            }

        })

        return [serverSnapshot, error];

    }
        /**
     * Get the IDs of doc_meta records that belong to a specific user.
     *
     * @param firestore Firestore instance.
     * @param uid The uid of the owner.
     */
    export async function getDocMetaIDs(firestore: IFirestoreClient,
                                        uid: UIDStr): Promise<ReadonlyArray<{ readonly id: string, readonly migrated: boolean }>> {

        const data = await firestore
            .collection('doc_meta')
            .where('uid', '==', uid)
            .get();

        const toDocMeta = (snapshot: IQueryDocumentSnapshot<unknown>): RecordHolder<DocMetaHolder> =>
            snapshot.data() as RecordHolder<DocMetaHolder>;

        return data.docs.map(toDocMeta).map(({ id, value: { ver } }) => ({ id, migrated: ver === 3 }));
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
            name: MIGRATION_NAME,
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
            name: MIGRATION_NAME,
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
            name: MIGRATION_NAME,
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
    const migrateData = React.useCallback(async () => {
        if (progressDataRef.current) { // The migration has already been started. just skip
            return;
        }

        if (! user) {
            throw new Error('useMigratorExecutor: user not found');
        }

        const docMetas = await MigrationToBlockAnnotationsHelpers.getDocMetaIDs(firestore, user.uid);

        const started = ISODateTimeStrings.create();
        const total = docMetas.length;
        const unmigratedDocMetas = docMetas.filter(({ migrated }) => ! migrated);

        setProgressData({
            total,
            started,
            current: total - unmigratedDocMetas.length,
        });

        await MigrationToBlockAnnotationsHelpers
            .writeMigrationStarted(firestore, user.uid, started);

        for (const { id } of unmigratedDocMetas) {
            try {
                await MigrationToBlockAnnotationsHelpers.migrateDocMeta(id);
            } catch (e) {
                console.log(`Migration of doc_meta with the id: ${id} has failed`, e);
            }

            setProgressData(({
                total,
                started,
                current: progressDataRef.current!.current + 1,
            }));

        }

        await MigrationToBlockAnnotationsHelpers
            .writeMigrationCompleted(firestore, user.uid, started, ISODateTimeStrings.create());

    }, [setProgressData, progressDataRef, firestore, user]);

    /**
     * Start the migration process
     */
    const migrationExecutor = React.useCallback(() => {
        migrateData()
            .catch((err) => {
                if (! user) {
                    return console.error('useMigratorExecutor: user not found');
                }

                console.error('MigrationToBlockAnnotations failed with error', err);
                setError(err);

                const started = progressDataRef.current!.started;

                MigrationToBlockAnnotationsHelpers
                    .writeMigrationFailed(firestore, user.uid, started, ISODateTimeStrings.create())
                    .catch(console.error);

            });
    }, [migrateData, setError, user, firestore, progressDataRef]);

    return { progressData, error, migrationExecutor };
}

export const MIGRATION_TO_BLOCKS_ENABLED = LocalStorageFeatureToggles.get('migration-to-block-annotations');

export const MigrationToBlockAnnotations = React.memo((props: IProps) => {

    const [migrationSnapshot, error] = useMigrationSnapshotByName(MIGRATION_NAME);
    const { progressData, error: migrationError, migrationExecutor } = useMigrationExecutor();

    React.useEffect(() => {

        if (migrationSnapshot?.empty && MIGRATION_TO_BLOCKS_ENABLED) {
            migrationExecutor();
        }

    }, [migrationSnapshot, migrationExecutor]);


    if (! migrationSnapshot) {
        return <LinearProgress />;
    }

    if (! MIGRATION_TO_BLOCKS_ENABLED
        || (migrationSnapshot.docs.length > 0 && migrationSnapshot.docs[0].status === 'completed')) {

        return props.children;
    }

    if (error) {
        <Alert severity="error">
            We're unable to migrate your data: <q>{error.message}</q>
        </Alert>
    }

    if (migrationError) {
        <Alert severity="error">
            We're unable to migrate your data: <q>{migrationError.message}</q>
        </Alert>
    }

    const percentage = progressData ? Percentages.calculate(progressData.current, progressData.total) : 0;

    return (
        <AdaptiveDialog>
            <MigrationToBlockAnnotationsMain progress={percentage} />
        </AdaptiveDialog>
    );
});
