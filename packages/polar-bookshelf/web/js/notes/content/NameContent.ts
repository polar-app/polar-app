import {makeObservable, observable, computed} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {INameContent} from "polar-blocks/src/blocks/content/INameContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";

export class NameContent implements INameContent, IBaseBlockContent {

    @observable private readonly _type: 'name';
    @observable private _data: string;
    @observable private _mutator: DeviceIDStr;

    constructor(opts: INameContent) {

        this._type = opts.type;
        this._data = opts.data;
        this._mutator = opts.mutator || '';

        makeObservable(this)

    }

    @computed get type() {
        return this._type;
    }

    @computed get data() {
        return this._data;
    }

    @computed get mutator() {
        return this._mutator;
    }

    public update(content: IBlockContent) {
        if (content.type === 'name') {
            this._data = content.data;
            this._mutator = content.mutator || '';
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public setMutator(mutator: DeviceIDStr) {
        this._mutator = mutator;
    }

    public toJSON(): INameContent {
        return {
            type: this._type,
            data: this._data,
            mutator: this._mutator,
        };
    }

}

