import {makeObservable, observable, computed} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {DateContentFormat, IDateContent} from "polar-blocks/src/blocks/content/IDateContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";

export class DateContent implements IDateContent, IBaseBlockContent {

    @observable private readonly _type: 'date';
    @observable private _data: string;
    @observable private _format: DateContentFormat;

    constructor(opts: IDateContent) {

        this._type = opts.type;
        this._data = opts.data;
        this._format = opts.format;

        makeObservable(this)

    }

    @computed get type() {
        return this._type;
    }

    @computed get data() {
        return this._data;
    }

    @computed get format() {
        return this._format;
    }

    public update(content: IBlockContent) {

        if (content.type === 'date') {
            this._data = content.data;
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): IDateContent {
        return {
            type: this._type,
            data: this._data,
            format: this._format
        }
    }

}

