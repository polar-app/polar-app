/**
 * An action to just *read* some text for review.  This is just a string.
 */
export interface ReadingTaskAction<T> {
    readonly type: 'reading';
    readonly original: T;
}