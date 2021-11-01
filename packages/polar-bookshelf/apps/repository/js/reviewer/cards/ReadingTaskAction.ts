import {Img} from "polar-shared/src/metadata/Img";

/**
 * An action to just *read* some text for review.  This is just a string.
 */
export interface IReadingTaskAction<T = unknown> {
    readonly type: 'reading';
    readonly img?: Img;
    readonly text?: string;
    readonly updated: string;
    readonly created: string;
    readonly original: T;
}
