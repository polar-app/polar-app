import { IFirestore } from 'polar-firestore-like/src/IFirestore';
import { ISODateTimeString } from 'polar-shared/src/metadata/ISODateTimeStrings';
import { IDStr, UserIDStr } from 'polar-shared/src/util/Strings';

export namespace CloudProgresCollection {
    const COLLECTION_NAME = "cloud_progress";
    
    export interface ICloudProgress {
        id: string;
        progress: number;
        started: ISODateTimeString;
        written: ISODateTimeString;
        uid: UserIDStr;
        meta: meta;
    };

    export type ICloudProgressUpdate = Required<Pick<ICloudProgress, 'written' | 'progress'>>;

    export interface meta {
        [key: string]: string | number | boolean;
    };

    export async function set<SM = unknown>(firestore: IFirestore<SM>,
                                            id: IDStr,
                                            cloudProgress: ICloudProgress) {

        const collection = firestore.collection(COLLECTION_NAME)
        
        const doc = collection.doc(id);

        await doc.set(cloudProgress);
    }

    export async function update<SM = unknown>(firestore: IFirestore<SM>,
                                               id: IDStr,
                                               cloudProgressUpdate: ICloudProgressUpdate) {

        const collection = firestore.collection(COLLECTION_NAME);

        const doc = collection.doc(id);        

        await doc.update(cloudProgressUpdate);
    }
};