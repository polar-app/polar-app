import {AnkiConnectFetch} from '../AnkiConnectFetch';
import {IDStr} from "polar-shared/src/util/Strings";

export class CreateModeClient implements ICreateModelClient {

    public async execute(opts: ICreateModelOpts): Promise<string[]> {

        const body = {
            action: "createModel",
            version: 6,
            params: {
                ...opts
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <string[]> await AnkiConnectFetch.fetch(init);

    }

}

export type ModelNameStr = IDStr;

export interface ICardTemplate {
    readonly Name: string;
    readonly Front: string;
    readonly Back: string;
}

export interface ICreateModelOpts {
    readonly modelName: string;
    readonly inOrderFields: ReadonlyArray<ModelNameStr>;
    readonly css?: string;
    readonly cardTemplates: ReadonlyArray<ICardTemplate>;
}

export interface ICreateModelClient {

    execute(opts: ICreateModelOpts): Promise<string[]>;

}
