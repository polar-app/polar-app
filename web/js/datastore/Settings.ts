import {DocRepoTableColumns} from "../../../apps/repository/js/doc_repo/DocRepoTableColumns";

/**
 * User settings for the UI.
 */
export interface Settings {

    /**
     * When true, the user has opted out of tracking.
     */
    readonly disableTracking: boolean;

    readonly documentRepository: DocumentRepositorySettings;

}

export interface DocumentRepositorySettings {

    /**
     * Allows us to keep track of the columns that are enabled/disabled.
     */
    columns?: DocRepoTableColumns;

}

export class DefaultSettings implements Settings {

    public readonly disableTracking: boolean = false;

    public readonly documentRepository: DocumentRepositorySettings = {};

}
