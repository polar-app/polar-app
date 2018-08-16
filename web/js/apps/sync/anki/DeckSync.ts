/**
 * Code that synchronizes decks by creating new decks when the required decks
 * are missing.
 */
import {DeckDescriptor} from './DeckDescriptor';
import {DeckNamesAndIdsClient, IDeckNamesAndIdsClient} from './functions/DeckNamesAndIdsClient';
import {Sets} from '../../../util/Sets';
import {CreateDeckClient, ICreateDeckClient} from './functions/CreateDeckClient';

export class DeckSync {

    public createDeckClient: ICreateDeckClient = new CreateDeckClient();

    public deckNamesAndIdsClient: IDeckNamesAndIdsClient = new DeckNamesAndIdsClient();

    /**
     * Make sure all decks are properly setup in Anki.
     *
     * @param deckDescriptors The decks we need created.
     */
    async sync(deckDescriptors: DeckDescriptor[]) {

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
        missingDecks.forEach(deck => this.createDeckClient.execute(deck));

        return missingDeckDescriptors;

    }

}
