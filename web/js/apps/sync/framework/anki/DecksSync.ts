/**
 * Code that synchronizes decks by creating new decks when the required decks
 * are missing.
 */
import {DeckDescriptor} from './DeckDescriptor';
import {Sets} from '../../../../util/Sets';
import {CreateDeckClient, ICreateDeckClient} from './clients/CreateDeckClient';
import {DeckNamesAndIdsClient, IDeckNamesAndIdsClient} from './clients/DeckNamesAndIdsClient';
import {SyncProgressListener} from '../SyncProgressListener';
import {Abortable} from '../Abortable';
import {Logger} from '../../../../logger/Logger';
import {SyncQueue} from '../SyncQueue';

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
     * @param syncQueue The queue to use for async operations.
     *
     * @param deckDescriptors The decks we need created.
     *
     */
    enqueue(syncQueue: SyncQueue,
            deckDescriptors: DeckDescriptor[]) {

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

            missingDeckDescriptors.push(... missingDecks.map(name => <DeckDescriptor>{name}));

        });

        syncQueue.add(async () => {

            let createDeckTasks = missingDecks.map(missingDeck => {
                return async () => {
                    log.info("Creating missing deck: ", missingDeck);
                    await this.createDeckClient.execute(missingDeck);
                };
            });

            syncQueue.add(...createDeckTasks);

        });

        return missingDeckDescriptors;

    }

}
