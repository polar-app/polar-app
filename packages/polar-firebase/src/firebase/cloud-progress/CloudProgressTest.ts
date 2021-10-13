import { assert, expect } from 'chai';
import { FirestoreAdmin } from 'polar-firebase-admin/src/FirestoreAdmin';
import { CloudProgresCollection } from '../om/CloudProgressCollection';
import { CloudProgress } from './CloudProgress';


describe('CloudProgress', () => {
    const DOC_ID = 'FAKE_DOCUMENT';

    const UID = 'FAKE_USER';

    const TASKS = 10;

    const firestore = FirestoreAdmin.getInstance();

    it('can be marked as started', async () => {
        const cloudProgress = await CloudProgress.create(DOC_ID, UID).init(TASKS);

        const testTypeKeys: Array<keyof CloudProgresCollection.IProgressStarted> = [
            'duration',
            'meta',
            'percentage',
            'started',
            'type',
            'uid',
            'written'
        ];

        await cloudProgress.step();
        
        const doc = await CloudProgresCollection.get(firestore, DOC_ID);

        expect(doc).to.include({ percentage: 10, type: 'started' });

        expect(doc).to.include.keys(testTypeKeys);
    });
    
    it('can be marked as failed', async () => {
        const failureMessage = "testing failure";

        const cloudProgress = await CloudProgress.create(DOC_ID, UID).init(TASKS);

        await cloudProgress.step();

        await cloudProgress.fail(failureMessage);
        
        
        const doc = await CloudProgresCollection.get(firestore, DOC_ID);

        expect(doc).to.include({ percentage: 10, type: 'failed', message: failureMessage});


        expect(doc).to.include.keys(['failed']);
    });

    it('can be marked as completed', async () => {
        const cloudProgress = await CloudProgress.create(DOC_ID, UID).init(TASKS);

        await cloudProgress.step();

        await cloudProgress.complete();

        const doc = await CloudProgresCollection.get(firestore, DOC_ID);

        expect(doc).to.include({ percentage: 100, type: 'completed' });

        expect(doc).to.include.keys([ 'completed' ]);
    });

    it('can be manually set to an explicit value', async () => {
        const cloudProgress = await CloudProgress.createManual(DOC_ID, UID).init();

        await cloudProgress.step(50);

        const doc = await CloudProgresCollection.get(firestore, DOC_ID);

        expect(doc).to.include({ percentage: 50, type: 'started' });
    });

    it('can be manually completed', async () => {
        const cloudProgress = await CloudProgress.createManual(DOC_ID, UID).init();

        await cloudProgress.complete();

        const doc = await CloudProgresCollection.get(firestore, DOC_ID);

        expect(doc).to.include({ percentage: 100, type: 'completed' });
    });

    it('can fail in manual progress tracking', async () => {
        const failureMessage = 'test failure';
        const cloudProgress = await CloudProgress.createManual(DOC_ID, UID).init();

        await cloudProgress.fail(failureMessage);

        const doc = await CloudProgresCollection.get(firestore, DOC_ID);

        expect(doc).to.include({ percentage: 0, type: 'failed', message: failureMessage });
    });

    it('accurately calculates duration', () => {
        const seconds = 5;
        const startDateTime = new Date();

        const temp = new Date();
        const writeDateTime = new Date(
            temp.setTime(startDateTime.getTime() + (seconds * 1000))
        );

        const duration = CloudProgress.calcDuration(
            writeDateTime.toISOString(), startDateTime.toISOString()
        );

        assert.equal(duration, seconds);
    });

    after(async () => {
        await firestore.collection(CloudProgresCollection.COLLECTION_NAME)
            .doc(DOC_ID)
            .delete();
    });
});