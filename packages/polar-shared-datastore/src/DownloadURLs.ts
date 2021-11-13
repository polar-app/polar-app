import {URLs} from "polar-shared/src/util/URLs";
import {Backend} from "polar-shared/src/datastore/Backend";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {StoragePath} from "./FirebaseDatastores";
import {GetFileOpts} from "polar-shared/src/datastore/IDatastore";

export class DownloadURLs {

    public static async checkExistence(url: string): Promise<boolean> {

        // This is pretty darn slow when using HEAD but with GET and a range
        // query the performance isn't too bad.  Performing the HEAD directly
        // is really poor with 300-7500ms latencies.  There are some major
        // outliers when performing HEAD.
        //
        // Using GET and range of 0-0 is actually consistently about 200ms
        // which is pretty reasonable but we stills should have the option
        // to skip the exists check to just compute the URL.
        //
        // Doing an exists() with the Cloud SDK is about 250ms too.

        return await URLs.existsWithGETUsingRange(url);

    }

    public static computeDownloadURL(backend: Backend,
                                     ref: FileRef,
                                     storagePath: StoragePath,
                                     opts: GetFileOpts): string {

        return this.computeDownloadURLDirectly(backend, ref, storagePath, opts);

    }

    private static computeDownloadURLDirectly(backend: Backend,
                                              ref: FileRef,
                                              storagePath: StoragePath,
                                              opts: GetFileOpts): string {

        /**
         * Compute the storage path including the flip over whether we're
         * going to be public without any type of path conversion depending
         * on whether it's public or not.  Public URLs have a 1:1 mapping
         * where everything else might be in a different bucket or path
         * depending the storage computation function.
         */
        const toPath = (): string => {

            if (backend === Backend.PUBLIC) {
                // there is no blinding of the data path with the users
                // user ID or other key.
                return `${backend}/${ref.name}`;
            } else {
                return storagePath.path;
            }

        };

        const toURL = (): string => {

            const path = toPath();

            const project = process.env.POLAR_TEST_PROJECT || "polar-32b0f";

            return `https://storage.googleapis.com/${project}.appspot.com/${path}`;

        };

        return toURL();

    }

}
