import {Tag} from "polar-shared/src/tags/Tags";

/**
 * Represents an upload
 */
export interface IUpload {

    /**
     * The blob backing this upload.
     */
    readonly blob: () => Promise<Blob>;

    /**
     * The name of the upload (file name without path)
     */
    readonly name: string;

    /**
     * The relative path to the file so that we can build a path hierarchy.  May or may not have a forward slash
     * depending on how it was uploaded.
     *
     * Not all APIs support this so we need to also have undefined.
     */
    readonly path: string | undefined;

    /**
     * Tabs for the file (when known).
     */
    readonly tags?: ReadonlyArray<Tag>

}
