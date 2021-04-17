import {makeObservable, observable, computed} from "mobx"
import {INameContent} from "./INameContent";

export class NameContent implements INameContent {

    @observable private readonly _type: 'name';
    @observable private readonly _data: string;

    constructor(opts: INameContent) {

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

