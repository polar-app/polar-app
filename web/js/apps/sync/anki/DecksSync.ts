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

        let deckNamesAndIds = await this.deckNamesAndIdsClient.execute();

        // now I just need to compute the set difference deckDescriptors / deckNamesAndIds
        // for all decks that are not in deckNamesAndIds

        let currentDecks: string[] = Object.keys(deckNamesAndIds);
        let expectedDecks = deckDescriptors.map(current => current.name);

        let missingDecks = Sets.difference(expectedDecks, currentDecks);

        let missingDeckDescriptors = missingDecks.map(name => <DeckDescriptor>{name});

        // TODO: doing this in bulk might be better but we would need to batch
        // them out so we can measure progress easily and also not overwhelm
        // anki.

        // FIXME: only do this if missingDecks.length > 0

        let syncProgress: SyncProgress = {
            percentage: 0,
            state: SyncState.STARTED,
            error: undefined
        };

        let progress = new Progress(missingDecks.length);

        for (let idx = 0; idx < missingDecks.length; idx++) {
            const missingDeck = missingDecks[idx];

            if(abortable.aborted) {
                log.info("Aborting sync.");
                return;
            }

            await this.createDeckClient.execute(missingDeck);

            progress.incr();

            syncProgress.percentage = progress.percentage();

            syncProgressListener(Object.freeze(syncProgress));

        }

        return missingDeckDescriptors;

    }

}
