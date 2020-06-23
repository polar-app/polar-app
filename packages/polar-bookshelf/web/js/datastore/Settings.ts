import {DeckNameStrategy} from "../apps/sync/framework/anki/AnkiSyncEngine";
import { IDMap } from "polar-shared/src/util/IDMaps";

/**
 * User settings for the UI.
 */
export interface Settings {

    /**
     * When true, the user has opted out of tracking.
     */
    readonly disableTracking: boolean;

    readonly documentRepository: DocumentRepositorySettings;

    [key: string]: any;

}

export type ListOptionTypeMap = IDMap<ListOptionType>;

export interface ListOptionType {

    /**
     * The ID of the option.
     */
    id: string;

    /**
     * The label to show in the UI.
     */
    label: string;

    /**
     * True when the option is selected by the user.
     */
    selected: boolean;

    title?: string;

}

export interface DocumentRepositorySettings {

    /**
     * Allows us to keep track of the columns that are enabled/disabled.
     */
    readonly columns?: ListOptionTypeMap;

}

export interface AnkiSettings {

    readonly deckNameStrategy: DeckNameStrategy;

}

export class DefaultSettings implements Settings {

    public readonly disableTracking: boolean = false;

    public readonly documentRepository: DocumentRepositorySettings = {};

    public readonly ankiSettings: AnkiSettings = {
        deckNameStrategy: 'per-document'
    };

}
