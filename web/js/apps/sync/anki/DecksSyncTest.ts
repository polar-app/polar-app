import {DecksSync} from './DecksSync';
import {DeckDescriptor} from './DeckDescriptor';
import {assertJSON} from '../../../test/Assertions';
import {DeckNamesAndIdsClient} from './clients/DeckNamesAndIdsClient';
import {CreateDeckClient} from './clients/CreateDeckClient';


describe('DesksSync', function() {

    let deckSync = new DecksSync();

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
