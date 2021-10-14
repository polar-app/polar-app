import { IFirestore } from 'polar-firestore-like/src/IFirestore';
import { ISODateTimeString } from 'polar-shared/src/metadata/ISODateTimeStrings';
import { Percentage } from 'polar-shared/src/util/ProgressTracker';
import { IDStr, UserIDStr } from 'polar-shared/src/util/Strings';

export namespace CloudProgresCollection {
    export const COLLECTION_NAME = "cloud_progress";
    
    export interface ICloudProgressMeta {
        [key: string]: string | number | boolean;
    };

    export type IProgressStarted = {
        readonly id: string;
        readonly percentage: Percentage;
        readonly written: ISODateTimeString;
        readonly started: ISODateTimeString;
        readonly uid: UserIDStr;
        readonly meta: ICloudProgressMeta;
        readonly duration: number;
        type: 'started' | 'completed' | 'failed'
    };

    export type IProgressCompleted = IProgressStarted & {
        completed: ISODateTimeString;
    };

    export type IProgressFailed = IProgressStarted & {
        failed: ISODateTimeString;
        message: string;
    };

    export type ICloudProgress = IProgressStarted |
                                 IProgressCompleted |
                                 IProgressFailed;


    export type ICloudProgressUpdateShared = Partial<Pick<IProgressStarted, 'written' | 'percentage' | 'duration'>>;

    export type ICloudProgressUpdateFailed = ICloudProgressUpdateShared & 
                                             Required<Pick<IProgressFailed, 'failed' | 'type' | 'message'>>;

    export type ICloudProgressUpdateCompleted = ICloudProgressUpdateShared &
                                                Required<Pick<IProgressCompleted, 'completed' | 'type'>>;

    export type ICloudProgressUpdate = ICloudProgressUpdateShared |
                                       ICloudProgressUpdateCompleted |
                                       ICloudProgressUpdateFailed;


    export async function get<SM = unknown>(firestore: IFirestore<SM>, id: IDStr): Promise<ICloudProgress | undefined> {
        const snapshot = await firestore.collection(COLLECTION_NAME).doc(id).get();

        if (snapshot.exists) {
            return snapshot.data() as ICloudProgress;
        }

        return undefined;
    }
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