export type AnkiSyncErrorCode = 'no-anki-connect';

export class AnkiSyncError extends Error {

    readonly code: AnkiSyncErrorCode;

    constructor(message: string, code: AnkiSyncErrorCode) {
        super(message);
        this.code = code;
    }

}