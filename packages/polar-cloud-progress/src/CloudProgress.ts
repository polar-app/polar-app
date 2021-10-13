import { Percentage, ProgressTracker } from 'polar-shared/src/util/ProgressTracker';
import { IDStr, UserIDStr } from 'polar-shared/src/util/Strings';
import { FirestoreAdmin } from "polar-firebase-admin/src/FirestoreAdmin";
import { Debouncers } from 'polar-shared/src/util/Debouncers';
import { CloudProgresCollection } from 'polar-firebase/src/firebase/om/CloudProgressCollection';
import { ISODateString, ISODateTimeString } from 'polar-shared/src/metadata/ISODateTimeStrings';
import { IFirestore } from 'polar-firestore-like/src/IFirestore';

export namespace CloudProgress {

    export function calcDuration(write: ISODateTimeString, start: ISODateTimeString): number {
        const writeTime = new Date(write).getTime();
        const startTime = new Date(start).getTime();

        return (writeTime - startTime) / 1000;
    }

    /**
     * Gets duration in seconds and and current write timestamp
     * 
     * @param startTimestamp ISODateTimeString
     * @returns { written: ISODateTimeString, duration: number - in seconds }
     */
    function stampDuration (startTimestamp: ISODateTimeString) {
        const writtenTimestamp = new Date().toISOString();
        const duration = calcDuration(writtenTimestamp, startTimestamp);

        return { written: writtenTimestamp, duration };
    }

    async function sharedComplete(firestore: IFirestore<unknown>,
                                    id: string,
                                    startTimestamp: ISODateString) {
        await CloudProgresCollection.update(firestore, id, {
            percentage: 100,
            completed: new Date().toISOString(),
            type: 'completed',
            ...stampDuration(startTimestamp),
        });
    }

    async function sharedFail(firestore: IFirestore<unknown>,
                               id: string,
                               startTimestamp: ISODateString,
                               message: string) {
        await CloudProgresCollection.update(firestore, id, {
            message,
            failed: new Date().toISOString(),
            type: 'failed',
            ...stampDuration(startTimestamp)
        });
    }

    async function sharedStep(firestore: IFirestore<unknown>,
                                    id: string,
                                    startTimestamp: ISODateString,
                                    value: Percentage) {
        await CloudProgresCollection.update(firestore, id, {
            ...stampDuration(startTimestamp),
            percentage: value
        });
    }

export function create(id: IDStr,
                    uid: UserIDStr,
                    meta: CloudProgresCollection.ICloudProgressMeta = {}) {

const firestore = FirestoreAdmin.getInstance();
        
        const debouncer = Debouncers.inline(500);

        async function init(tasks: number) {
            
            const tracker = new ProgressTracker({
                id,
                total: tasks
            });

            const startTimestamp = new Date().toISOString();

            await CloudProgresCollection.set(firestore, id, {
                id,
                uid,
                meta,
                percentage: 0,
                duration: 0,
                started: startTimestamp,
                written: startTimestamp,
                type: 'started'
            });

            async function step() {
                tracker.incr();
                
                if (debouncer()) {
                    await sharedStep(
                        firestore,
                        id,
                        startTimestamp,
                        tracker.peek().progress
                    );
                }
            }

            /**
             * 
             * - Sets 'progress' to 100 just in case the function being tracked finished under 500ms
             *      or the last step was debounced
             * 
             * - Sets 'completed' timestamp
             * - Sets 'type' to 'completed'
             */
            async function complete() {
                await sharedComplete(firestore, id, startTimestamp);
            }

            async function fail(message: string) {
                await sharedFail(firestore, id, startTimestamp, message);
            }

            return { step, complete, fail };
        }

        return { init };
    }

    export function createManual(id: IDStr,
                                 uid: UserIDStr,
                                 meta: CloudProgresCollection.ICloudProgressMeta = {}) {
    
        const firestore = FirestoreAdmin.getInstance();

        const debouncer = Debouncers.inline(500);

        async function init() {
            const startTimestamp = new Date().toISOString();

            await CloudProgresCollection.set(firestore, id, {
                id,
                uid,
                meta,
                percentage: 0,
                duration: 0,
                started: startTimestamp,
                written: startTimestamp,
                type: 'started'
            });

            async function step(value: Percentage) {
                if (debouncer()) {
                    await sharedStep(
                        firestore,
                        id,
                        startTimestamp,
                        value
                    )
                }
            }

            /**
             * 
             * - Sets 'progress' to 100 just in case the function being tracked finished under 500ms
             *      or the last step was debounced
             * 
             * - Sets 'completed' timestamp
             * - Sets 'type' to 'completed'
             */
            async function complete() {
                await sharedComplete(firestore, id, startTimestamp);
            }

            async function fail(message: string) {
                await sharedFail(firestore, id, startTimestamp, message);
            }

            return { step, complete, fail };
        }

        return { init };
    }

}