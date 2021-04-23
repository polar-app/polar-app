import {IBlock, NamespaceIDStr, UIDStr} from "./IBlock";
import {INewChildPosition, BlockIDStr, BlockContent, IBlockContent} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import { Contents } from "../content/Contents";

export class Block<C extends BlockContent = BlockContent> implements IBlock<C> {

    @observable private _id: BlockIDStr;

    /**
     * The graph to which this page belongs.
     */
    @observable private _nspace: NamespaceIDStr;

    /**
     * The owner of this block.
     */
    @observable readonly _uid: UIDStr;

    @observable private _parent: BlockIDStr | undefined;

    @observable private _created: ISODateTimeString;

    @observable private _updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    @observable private _items: BlockIDStr[];

    @observable private _content: C;

    /**
     * The linked wiki references to other blocks.
     */
    @observable private _links: BlockIDStr[];

    constructor(opts: IBlock<C | IBlockContent>) {

        this._id = opts.id;
        this._nspace = opts.nspace;
        this._uid = opts.uid;
        this._parent = opts.parent;
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = [...opts.items];
        this._content = Contents.create(opts.content);
        this._links = [...opts.links];

        makeObservable(this)

    }

    @computed get id() {
        return this._id;
    }

    @computed get nspace() {
        return this._nspace;
    }

    @computed get uid() {
        return this._uid;
    }

    @computed get parent() {
        return this._parent;
    }

    @computed get created() {
        return this._created;
    }

    @computed get updated() {
        return this._updated;
    }

    @computed get items(): ReadonlyArray<BlockIDStr> {
        return this._items;
    }

    @computed get content() {
        return this._content;
    }

    @computed get links(): ReadonlyArray<BlockIDStr> {
        return this._links;
    }

    @action setContent(content: C | IBlockContent) {

        this._content.update(content);
        this._updated = ISODateTimeStrings.create();

    }

    @action setParent(id: BlockIDStr) {
        this._parent = id;
        this._updated = ISODateTimeStrings.create();
    }

    @action setItems(items: ReadonlyArray<BlockIDStr>) {
        this._items = [...items];
        this._updated = ISODateTimeStrings.create();
    }

    @action addItem(id: BlockIDStr, pos?: INewChildPosition | 'first-child') {

        if (pos === 'first-child') {

            this._items.unshift(id);

        } else if (pos) {

            const idx = this._items.indexOf(pos.ref);

            if (idx !== -1) {
                const delta = pos.pos === 'before' ? 0 : 1;
                this._items.splice(idx + delta, 0, id);
            } else {
                throw new Error(`Unable to find item for position: ${pos.ref} ${pos.pos}`);
            }

        } else {
            this._items.push(id);
        }

        this._updated = ISODateTimeStrings.create();
    }

    @action removeItem(id: BlockIDStr) {

        const idx = this.items.indexOf(id);

        if (idx === -1) {
            return;
        }

        // this mutates the array under us and I don't necessarily like that
        // but it's a copy of the original to begin with.
        this._items.splice(idx, 1);
        this._updated = ISODateTimeStrings.create();

    }

    @action setLinks(links: ReadonlyArray<BlockIDStr>) {
        this._links = [...links];
        this._updated = ISODateTimeStrings.create();
    }

    @action addLink(id: BlockIDStr) {
        this._links.push(id);
        this._updated = ISODateTimeStrings.create();
    }

    @action removeLink(id: BlockIDStr) {

        const idx = this._links.indexOf(id);

        if (idx === -1) {
            return;
        }

        // this mutates the array under us and I don't necessarily like that
        // but it's a copy of the original to begin with.
        this._links.splice(idx, 1);
        this._updated = ISODateTimeStrings.create();

    }

    public toJSON(): IBlock<C> {

        return {
            id: this._id,
            nspace: this._nspace,
            uid: this._uid,
            parent: this._parent,
            created: this._created,
            updated: this._updated,
            items: this._items,
            content: this._content,
            links: this._links,
        };

    }

}
