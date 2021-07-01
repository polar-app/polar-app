import {makeObservable, observable, computed, toJS} from "mobx"
import {BlockIDStr, IBlockContent, IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";

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
        };
    }

    public addLink(link: IBlockLink) {
        this._links = [...this.links, link];
    }

    public removeLink(id: BlockIDStr) {
        const newLinks = [];
        let removed = false;
        // Only remove the first occurrence since we might have multiple links to the same block
        for (let link of this.links) {
            if (!removed && id === link.id) {
                removed = true;
                continue;
            }
            newLinks.push(link);
        }
        this._links = newLinks;
    }
}

