import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

/**
 *
 * canAddNotes
 *
 * Accepts an array of objects which define parameters for candidate notes (see addNote) and returns an array of booleans indicating whether or not the parameters at the corresponding index could be used to create a new note.
 *
 * Sample request:
 *
 * {
 *    "action": "canAddNotes",
 *    "version": 6,
 *    "params": {
 *        "notes": [
 *            {
 *                "deckName": "Default",
 *                "modelName": "Basic",
 *                "fields": {
 *                    "Front": "front content",
 *                    "Back": "back content"
 *                },
 *                "tags": [
 *                    "yomichan"
 *                ]
 *            }
 *        ]
 *    }
 *}
 * Sample result:
 *
 * {
 *    "result": [true],
 *    "error": null
 *}
 *
 * */
export class CanAddNotesClient implements ICanAddNotesClient {

    public async execute(notes: readonly Note[]): Promise<readonly boolean[]> {

        const body = {
            action: "canAddNotes",
            version: 6,
            params: {
                notes
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <readonly boolean[]> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock(result: readonly boolean[]) {
        const client = TypeMoq.Mock.ofType<ICanAddNotesClient>();
        client.setup(x => x.execute(TypeMoq.It.isAny())).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export interface Note {

    readonly deckName: string;
    readonly modelName: string;
    readonly fields: {readonly [name: string]: string};
    readonly tags: readonly string[];

}

export interface ICanAddNotesClient {

    execute(notes: readonly Note[]): Promise<readonly boolean[]>;

}
