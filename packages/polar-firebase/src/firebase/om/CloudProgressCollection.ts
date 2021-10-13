import { IFirestore } from 'polar-firestore-like/src/IFirestore';
import { ISODateTimeString } from 'polar-shared/src/metadata/ISODateTimeStrings';
import { IDStr, UserIDStr } from 'polar-shared/src/util/Strings';

export namespace CloudProgresCollection {
    const COLLECTION_NAME = "cloud_progress";
    
    type IProgressShared = {
        readonly id: string;
        readonly progress: number;
        readonly started: ISODateTimeString;
        readonly written: ISODateTimeString;
        readonly uid: UserIDStr;
        readonly meta: ICloudProgressMeta;
        readonly duration: number;
        type: 'started' | 'completed' | 'failed'
    };

    type IProgressCompleted = IProgressShared & {
        completed: ISODateTimeString;
    };

    type IProgressFailed = IProgressShared & {
        failed: ISODateTimeString;
        message: string;
    }

    export type ICloudProgress = IProgressCompleted | IProgressFailed;

    type ICloudProgressUpdateFailed = Partial<Pick<IProgressFailed, 'written' | 'progress' | 'duration' | 'failed' | 'message'>>;
    type ICloudProgressUpdateCompleted = Partial<Pick<IProgressCompleted, 'written' | 'progress' | 'duration' | 'completed'>>;

    export type ICloudProgressUpdate = ICloudProgressUpdateCompleted | ICloudProgressUpdateFailed;

    export interface ICloudProgressMeta {
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