/**
 * Code that synchronizes decks by creating new decks when the required decks
 * are missing.
 */
import {DeckDescriptor} from './DeckDescriptor';
import {DeckNamesAndIdsClient} from './functions/DeckNamesAndIdsClient';
import {Sets} from '../../../util/Sets';

export class DeckSync {

    /**
     * Make sure all decks are properly setup in Anki.
     *
     * @param deckDescriptors The decks we need created.
     */
    static async sync(deckDescriptors: DeckDescriptor[]) {

        let deckNamesAndIds = await DeckNamesAndIdsClient.execute();

        // now I just need to compute the set difference deckDescriptors / deckNamesAndIds
        // for all decks that are not in deckNamesAndIds

        let currentDecks: string[] = Object.keys(deckNamesAndIds);
        let expectedDecks = deckDescriptors.map(current => current.name);

        let missingDecks = Sets.difference(currentDecks, expectedDecks);

    }

}
