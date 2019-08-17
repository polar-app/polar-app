import {Backend} from "./Backend";
import {FileRef} from "./Datastore";

/**
 * A FileRef with a backend.
 */
export interface BackendFileRef extends FileRef {

    readonly backend: Backend;

}
