/**
 * User settings for the UI.
 */
export interface Settings {

    /**
     * When true, the user has opted out of tracking.
     */
    readonly disableTracking?: boolean;

    readonly documentRepository?: DocumentRepositorySettings;

}

export interface DocumentRepositorySettings {

    /**
     * Allows us to keep track of the columns that are enabled/disabled.
     */
    columns?: EnabledColumnIndex;

}

// noinspection TsLint
export type EnabledColumnIndex = {[key: string]: boolean};
