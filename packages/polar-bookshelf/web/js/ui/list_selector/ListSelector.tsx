import {IDMap} from "polar-shared/src/util/IDMaps";

export type ListOptionTypeMap = IDMap<ListOptionType>;

export interface ListOptionType {

    /**
     * The ID of the option.
     */
    readonly id: string;

    /**
     * The label to show in the UI.
     */
    readonly label: string;

    /**
     * True when the option is selected by the user.
     */
    readonly selected: boolean;

    readonly title?: string;

}

