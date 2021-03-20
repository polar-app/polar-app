import * as React from 'react';
import {IDMap} from "polar-shared/src/util/IDMaps";

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

