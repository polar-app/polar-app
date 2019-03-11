import {FileMeta, FileRef} from './Datastore';
import {Backend} from './Backend';

export interface DocFileMeta {

    readonly backend: Backend;

    readonly ref: FileRef;

    /**
     * URL to the file that can be used within the browser to load or download
     * the resource.  The URL should be accessible for the user so cookies or
     * whatever authentication strategy is in effect should work for the user
     * in this browser instance.
     */
    readonly url: string;

    readonly meta: FileMeta;

}
