import {ISODateTimeString} from './ISODateTimeStrings';

export interface ReadingProgress {

    readonly id: string;

    /**
     * The time time this was created.
     */
    readonly created: ISODateTimeString;

    /**
     * The reading progress / percentag completed for the current page.
     */
    readonly progress: number;

    readonly progressByMode: ProgressByMode;

}

export interface ProgressByMode {
    [id: string]: number;
}


