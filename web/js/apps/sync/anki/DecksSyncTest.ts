import {DecksSync} from './DecksSync';
import {DeckDescriptor} from './DeckDescriptor';
import {assertJSON} from '../../../test/Assertions';
import {DeckNamesAndIdsClient} from './clients/DeckNamesAndIdsClient';
import {CreateDeckClient} from './clients/CreateDeckClient';
import {Abortable} from '../Abortable';
import {SyncProgressListener} from '../SyncProgressListener';
import {SyncProgress} from '../SyncProgress';


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

        let abortable: Abortable = {
            aborted: false
        };

        let _syncProgress: SyncProgress | undefined = undefined;

        let syncProgressListener: SyncProgressListener = (syncProgress: Readonly<SyncProgress>) => {
            console.log("Sync state: ", syncProgress);
            _syncProgress = syncProgress;
        };

        let createdDescriptors = await deckSync.sync(deckDescriptors, abortable, syncProgressListener);

        assertJSON(createdDescriptors, [
            {
                "name": "Test Deck"
            }
        ]);

        assertJSON(_syncProgress, {
            "percentage": 100,
            "state": "STARTED"
        });

    });

});
