// @NotStale
import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

/**
 *
 */
export class AddNotesClient implements IAddNotesClient {

    public async execute(notes: readonly Note[]): Promise<readonly number[]> {

        const body = {
            action: "addNotes",
            version: 6,
            params: {
                notes
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <readonly number[]> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock(result: readonly number[]) {
        const client = TypeMoq.Mock.ofType<IAddNotesClient>();
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

export interface IAddNotesClient {

    execute(notes: readonly Note[]): Promise<readonly number[]>;

}
