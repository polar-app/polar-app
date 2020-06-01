export interface ProgressEvent {

    /**
     * The progress of the app in a percentage from 0 to 100.
     */
    readonly percentage: number;

    readonly message?: string;

}
