import {makeObservable, observable, computed} from "mobx"
import {IMarkdownContent} from "./IMarkdownContent";

export class MarkdownContent implements IMarkdownContent {

    @observable private readonly _type: 'markdown';
    @observable private readonly _data: string;

    constructor(opts: IMarkdownContent) {

        this._type = opts.type;
        this._data = opts.data;

        makeObservable(this)

    }

    @computed get type() {
        return this._type;
    }

    @computed get data() {
        return this._data;
    }

}

