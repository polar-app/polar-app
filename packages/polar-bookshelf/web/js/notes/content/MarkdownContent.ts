import {makeObservable, observable, computed, toJS} from "mobx"
import {BlockIDStr, IBlockContent, IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";

export class MarkdownContent implements IMarkdownContent, IBaseBlockContent {

    @observable private readonly _type: 'markdown';
    @observable private _data: string;
    @observable private _links: ReadonlyArray<IBlockLink>;
    @observable private _mutator: DeviceIDStr;

    constructor(opts: IMarkdownContent) {

        this._type = opts.type;
        this._data = opts.data;
        this._links = [...(opts.links || [])];
        this._mutator = opts.mutator || '';

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

    @computed get mutator() {
        return this._mutator;
    }

    public update(content: IBlockContent) {

        if (content.type === 'markdown') {
            this._data = content.data;
            this._links = content.links;
            this._mutator = content.mutator || '';
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public setMutator(mutator: DeviceIDStr) {
        this._mutator = mutator;
    }

    public toJSON(): IMarkdownContent {
        return {
            type: this._type,
            data: this._data,
            links: toJS(this._links),
            mutator: this._mutator,
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

