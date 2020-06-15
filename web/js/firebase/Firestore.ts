import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {Firebase} from './Firebase';
import {Logger} from "polar-shared/src/logger/Logger";
import {Tracer} from 'polar-shared/src/util/Tracer';
import {Preconditions} from "polar-shared/src/Preconditions";

const log = Logger.create();

export class Firestore {

    private static instance: firebase.firestore.Firestore | undefined = undefined;

    /**
     * Allows us to init with custom options.
     */
    public static async init(opts: FirestoreOptions = {enablePersistence: true}) {

        if (this.instance) {
            return;
        }

        console.log("Initializing Firestore with options: ", opts);

        this.instance = await Firestore.createInstance(opts);

    }

    public static async getInstance(): Promise<firebase.firestore.Firestore> {

        Preconditions.assertPresent(firebase, 'firebase');
        Firebase.init();
        await this.init();
        return this.instance!;

    }

    private static async createInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

        const doExecAsync = async (): Promise<firebase.firestore.Firestore> => {

            try {

                log.notice("Initializing firestore...");

                const firestore = firebase.firestore();

                const settings = {
                    // timestampsInSnapshots: true
                    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
                };

                firestore.settings(settings);

                if (opts.enablePersistence) {
                    await this.enablePersistence(firestore);
                }

                return firestore;

            } finally {
                log.notice("Initializing firestore...done");
            }

        }

        return await Tracer.async(doExecAsync, 'createInstance');

    }

    private static async enablePersistence(firestore: firebase.firestore.Firestore) {

        const doExecAsync = async () => {

            try {

                // Without synchronizeTabs=true the main document repository works
                // but the viewer windows complain that they do not have access to
                // work with the disk persistence.


                console.time('enable-firestore-persistence');
                await firestore.enablePersistence({synchronizeTabs: true});
                console.timeEnd('enable-firestore-persistence');

            } catch (e) {
                // we've probably exceeded the local quota so we can't run with caching for now.
                console.warn("Unable to use persistence. Data will not be cached locally: ", e);
            }

        }
            // TODO: this seems super slow and not sure why.  The tab sync
        // seems to not impact performance at all.
        await Tracer.async(doExecAsync, 'enablePersistence');

    }

}

export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}






