import {makeObservable, observable, computed, toJS} from "mobx"
import {IMarkdownContent} from "./IMarkdownContent";
import {IBlockContent} from "../store/BlocksStore";
import {IBaseBlockContent} from "./IBaseBlockContent";
import {IBlockLink} from "../store/IBlock";

export class MarkdownContent implements IMarkdownContent, IBaseBlockContent {

    @observable private readonly _type: 'markdown';
    @observable private _data: string;
    @observable private _links: ReadonlyArray<IBlockLink>;

    constructor(opts: IMarkdownContent) {

        this._type = opts.type;
        this._data = opts.data;
        // TODO: This is due to old records in firestore that don't have the links property
        this._links = [...(opts.links || [])];

        makeObservable(this)

    }

    @computed get type() {
        return this._type;
    }

    @computed get data() {
        return this._data;
    }

    @computed get links() {
        return this._links;
    }

    public update(content: IBlockContent) {

        if (content.type === 'markdown') {
            this._data = content.data;
            this._links = content.links;
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): IMarkdownContent {
        return {
            type: this._type,
            data: this._data,
            links: toJS(this._links),
        }
    }

}

