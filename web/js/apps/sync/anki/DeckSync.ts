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

        let deckNamesAndIds = await this.deckNamesAndIdsClient.execute();

        // now I just need to compute the set difference deckDescriptors / deckNamesAndIds
        // for all decks that are not in deckNamesAndIds

        let currentDecks: string[] = Object.keys(deckNamesAndIds);
        let expectedDecks = deckDescriptors.map(current => current.name);

        let missingDecks = Sets.difference(expectedDecks, currentDecks);

        let missingDeckDescriptors = missingDecks.map(name => <DeckDescriptor>{name});

        return missingDeckDescriptors;

    }

}
