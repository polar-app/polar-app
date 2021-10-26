// @NotStale
import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

/**
 *
 * Returns a list of objects containing for each note ID the note fields, tags,
 * note type and the cards belonging to the note.
 *
 * Sample request:
 *
 * {
 *    "action": "notesInfo",
 *    "version": 6,
 *    "params": {
 *    "notes": [1502298033753]
 * }
 *
 * Sample result:
 *
 * {
 *    "result": [
 *    {
 *        "noteId":1502298033753,
 *        "modelName": "Basic",
 *        "tags":["tag","another_tag"],
 *        "fields": {
 *            "Front": {"value": "front content", "order": 0},
 *            "Back": {"value": "back content", "order": 1}
 *        }
 *    }
 * ],
 * "error": null
 *
 */
export class NotesInfoClient implements INotesInfoClient {

    public async execute(notes: readonly number[]): Promise<readonly NoteInfo[]> {

        const body = {
            action: "notesInfo",
            version: 6,
            params: {
                notes
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <readonly NoteInfo[]> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock(result: readonly NoteInfo[]) {
        const client = TypeMoq.Mock.ofType<INotesInfoClient>();
        client.setup(x => x.execute(TypeMoq.It.isAny())).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export interface INotesInfoClient {

    execute(notes: readonly number[]): Promise<readonly NoteInfo[]>;

}

interface NoteInfo {
    readonly noteId: number;
    readonly modelName: string;
    readonly tags: readonly string[];
    readonly fields: {readonly [name: string]: Field};
}

interface Field {
    readonly value: string;
    readonly order: number;
}

