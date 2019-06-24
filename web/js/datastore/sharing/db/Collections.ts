import {Firestore} from '../../../firebase/Firestore';

export class Collections {

    public static async deleteByID(collection: string,
                                   provider: () => Promise<ReadonlyArray<IDRecord>>) {

        const firestore = await Firestore.getInstance();

        const records = await provider();

        for (const record of records) {
            const doc = firestore.collection(collection).doc(record.id);
            await doc.delete();
        }

    }

}

export interface IDRecord {
    readonly id: string;
}
