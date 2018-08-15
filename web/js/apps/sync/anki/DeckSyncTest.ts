import {DeckSync} from './DeckSync';
import {DeckDescriptor} from './DeckDescriptor';
import {DeckNamesAndIdsClient} from './functions/DeckNamesAndIdsClient';
import {CreateDeckClient} from './functions/CreateDeckClient';
import {assertJSON} from '../../../test/Assertions';


describe('DeskSync', function() {

    let deckSync = new DeckSync();

    deckSync.createDeckClient = CreateDeckClient.createMock(1);
    deckSync.deckNamesAndIdsClient = DeckNamesAndIdsClient.createMock({});

    it("basic sync", async function () {

        let deckDescriptors: DeckDescriptor[] = [
            {
                name: "Test Deck"
            }
        ];

        let createdDescriptors = await deckSync.sync(deckDescriptors);

        let expected = [
            {
                "name": "Test Deck"
            }
        ];

        assertJSON(createdDescriptors, expected)

    });

});
