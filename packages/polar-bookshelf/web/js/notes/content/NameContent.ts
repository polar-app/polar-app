import {makeObservable, observable, computed} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {INameContent} from "polar-blocks/src/blocks/content/INameContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";

export class NameContent implements INameContent, IBaseBlockContent {

    @observable private readonly _type: 'name';
    @observable private _data: string;

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

    public update(content: IBlockContent) {
        if (content.type === 'name') {
            this._data = content.data;
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): INameContent {
        return {
            type: this._type,
            data: this._data
        }
    }

}

