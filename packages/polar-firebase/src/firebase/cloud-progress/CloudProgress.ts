import { ProgressTracker } from 'polar-shared/src/util/ProgressTracker';
import { IDStr, UserIDStr } from 'polar-shared/src/util/Strings';
import { FirestoreAdmin } from "polar-firebase-admin/src/FirestoreAdmin";
import { Debouncers } from 'polar-shared/src/util/Debouncers';
import { CloudProgresCollection } from '../om/CloudProgressCollection';

/**
 * 
 * [x] refactor to a functional API (ditch the stupid OOP)
 * [x] Make a collection interface in polar-firebase/OM dir
 * [] make an external and an internal progress functions
 * 
 */

export namespace CloudProgress {

    export async function create(id: IDStr,
                                 uid: UserIDStr,
                                 tasks: number,
                                 meta: CloudProgresCollection.meta = {}) {
                               
        const firestore = FirestoreAdmin.getInstance();

        const timestamp = new Date().toISOString();

        await CloudProgresCollection.set(firestore, id, {
            id,
            progress: 0,
            started: timestamp,
            written: timestamp,
            uid,
            meta
        });
        
        const tracker = new ProgressTracker({
            id,
            total: tasks
        });

        async function step() {
            tracker.incr();
            
            const value = tracker.peek().progress;
            
            const debouncer = Debouncers.inline();

            if (debouncer()) {
                const timestamp = new Date().toISOString();
                
                await CloudProgresCollection.update(firestore, id, {
                    written: timestamp,
                    progress: value
                });
            }
        }

        return { step }
    }

}
