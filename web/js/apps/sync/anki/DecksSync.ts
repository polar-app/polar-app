/**
 * Code that synchronizes decks by creating new decks when the required decks
 * are missing.
 */
import {DeckDescriptor} from './DeckDescriptor';
import {Sets} from '../../../util/Sets';
import {CreateDeckClient, ICreateDeckClient} from './clients/CreateDeckClient';
import {DeckNamesAndIdsClient, IDeckNamesAndIdsClient} from './clients/DeckNamesAndIdsClient';
import {SyncProgressListener} from '../SyncProgressListener';
import {Abortable} from '../Abortable';
import {Logger} from '../../../logger/Logger';
import {SyncProgress} from '../SyncProgress';
import {SyncState} from '../SyncState';
import {Progress} from '../../../util/Progress';
import {SyncQueue} from '../SyncQueue';
import {SyncRunner} from '../SyncRunner';

const log = Logger.create();

/**
 * Sync decks to Anki.
 */
export class DecksSync {

    public createDeckClient: ICreateDeckClient = new CreateDeckClient();

    public deckNamesAndIdsClient: IDeckNamesAndIdsClient = new DeckNamesAndIdsClient();

    /**
     * Make sure all decks are properly setup in Anki.
     *
     * @param deckDescriptors The decks we need created.
     *
     * @param abortable The abortable service running the sync. When aborted is
     * true we need to stop the sync.
     *
     * @param syncProgressListener A callback for the state while we're
     *     executing.
     */
    async sync(deckDescriptors: DeckDescriptor[],
               abortable: Abortable,
               syncProgressListener: SyncProgressListener) {

        // TODO: how do we detect if we're aborted...

        // TODO: decompose these into batches...

        let syncQueue = new SyncQueue(abortable, syncProgressListener);

        let missingDecks: string[] = [];
        let missingDeckDescriptors: DeckDescriptor[] = [];

        syncQueue.add(async () => {

            log.info("Fetching existing decks.");

            let deckNamesAndIds = await this.deckNamesAndIdsClient.execute();

            // now I just need to compute the set difference deckDescriptors / deckNamesAndIds
            // for all decks that are not in deckNamesAndIds

            let currentDecks: string[] = Object.keys(deckNamesAndIds);
            let expectedDecks = deckDescriptors.map(current => current.name);

            missingDecks = Sets.difference(expectedDecks, currentDecks);

            log.info(`Found ${missingDecks.length} missing decks`);

            missingDeckDescriptors = missingDecks.map(name => <DeckDescriptor>{name});

        });

        syncQueue.add(async () => {

            log.info("FIXME N missing decks: " + missingDecks.length)

            let createDeckTasks = missingDecks.map(missingDeck => {
                return async () => {
                    log.info("Creating missing deck: ", missingDeck);
                    await this.createDeckClient.execute(missingDeck);
                };
            });

            syncQueue.add(...createDeckTasks);

        });

        await syncQueue.execute();

        return missingDeckDescriptors;

    }

}
