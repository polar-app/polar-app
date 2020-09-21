import {Tag} from "polar-shared/src/tags/Tags";

/**
 * Represents an upload
 */
export interface IUpload {

    /**
     * The blob backing this upload.
     */
    readonly blob: Blob;

    /**
     * The name of the upload (file name without path)
     */
    readonly name: string;

    /**
     * The relative path to the file so that we can build a path hierarchy.
     */
    // readonly relativePath: string | undefined;

    /**
     * Tabs for the file (when known).
     */
    readonly tags?: ReadonlyArray<Tag>

}
