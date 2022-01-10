import {computed, observable, toJS} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {DataURLStr, IImageContent} from "polar-blocks/src/blocks/content/IImageContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {HasLinks} from "./HasLinks";

export class ImageContent extends HasLinks implements IImageContent, IBaseBlockContent {

    @observable private readonly _type: 'image';
    @observable private _src: DataURLStr;

    @observable private _width: number;
    @observable private _height: number;

    @observable private _naturalWidth: number;
    @observable private _naturalHeight: number;

    @observable private _mutator: DeviceIDStr;

    constructor(opts: IImageContent) {
        super(opts);

        this._type = opts.type;
        this._src = opts.src;
        this._width = opts.width;
        this._height = opts.height;
        this._naturalWidth = opts.naturalWidth;
        this._naturalHeight = opts.naturalHeight;
        this._mutator = opts.mutator || '';

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

    @computed get mutator() {
        return this._mutator;
    }

    public update(content: IBlockContent) {
        this.convertToObservable();

        if (content.type === 'image') {
            this._src = content.src;
            this._width = content.width;
            this._height = content.height;
            this._naturalHeight = content.naturalHeight;
            this._naturalWidth = content.naturalWidth;
            this._mutator = content.mutator || '';
            this.updateLinks(content.links);
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public setMutator(mutator: DeviceIDStr) {
        this.convertToObservable();
        this._mutator = mutator;
    }

    public toJSON(): IImageContent {

        return {
            type: this._type,
            src: this._src,
            width: this._width,
            height: this._height,
            naturalWidth: this._naturalWidth,
            naturalHeight: this._naturalHeight,
            mutator: this._mutator,
            links: toJS(this.links),
        };

    }


}

