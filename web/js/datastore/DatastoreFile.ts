export interface DatastoreFile {

    readonly name: string;

    /**
     * URL to the file that can be used within the browser to load or download
     * the resource.
     */
    readonly url: string;

}
