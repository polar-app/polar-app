import {ISODateTimeString} from './ISODateTimeStrings';

export interface ReadingProgress {

    readonly id: string;

    /**
     * The time time this was created.
     */
    readonly timestamp: ISODateTimeString;

    /**
     * The reading progress / percentag completed for the current page.
     */
    readonly progress: number;

}
