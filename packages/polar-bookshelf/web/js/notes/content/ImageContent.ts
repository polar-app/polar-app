import {makeObservable, observable, computed} from "mobx"
import {DataURLStr, IImageContent} from "./IImageContent";

export class ImageContent implements IImageContent {

    @observable private readonly _type: 'image';
    @observable private readonly _src: DataURLStr;

    @observable private readonly _width: number;
    @observable private readonly _height: number;

    @observable private readonly _naturalWidth: number;
    @observable private readonly _naturalHeight: number;


    constructor(opts: IImageContent) {

        this._type = opts.type;
        this._src = opts.src;
        this._width = opts.width;
        this._height = opts.height;
        this._naturalWidth = opts.naturalWidth;
        this._naturalHeight = opts.naturalHeight;

        makeObservable(this)

    }

    @computed get type() {
        return this._type;
    }

    @computed get src() {
        return this._src;
    }

    @computed get width() {
        return this._width;
    }

    @computed get height() {
        return this._height;
    }

    @computed get naturalWidth() {
        return this._naturalWidth;
    }

    @computed get naturalHeight() {
        return this._naturalHeight;
    }

}

