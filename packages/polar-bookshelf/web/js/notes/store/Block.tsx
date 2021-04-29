import {IBlock, IBlockLink, NamespaceIDStr, TMutation, UIDStr} from "./IBlock";
import {INewChildPosition, BlockIDStr, BlockContent, IBlockContent} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import { Contents } from "../content/Contents";
import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import PositionalArrayPositionStr = PositionalArrays.PositionalArrayPositionStr;
import deepEqual from "deep-equal";

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
    @observable private _items: PositionalArray<BlockIDStr>;

    @observable private _content: C;

    /**
     * The linked wiki references to other blocks.
     */
    @observable private _links: PositionalArray<IBlockLink>;

    @observable private _mutation: TMutation;

    constructor(opts: IBlock<C | IBlockContent>) {

        this._id = opts.id;
        this._nspace = opts.nspace;
        this._uid = opts.uid;
        this._parent = opts.parent;
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = {...opts.items};
        this._content = Contents.create(opts.content);
        this._links = {...opts.links};
        this._mutation = opts.mutation;

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

    @computed get items(): PositionalArray<BlockIDStr> {
        return this._items;
    }

    @computed get itemsAsArray(): ReadonlyArray<BlockIDStr> {
        return PositionalArrays.toArray(this._items);
    }

    @computed get content() {
        return this._content;
    }

    @computed get links(): PositionalArray<IBlockLink> {
        return this._links;
    }

    @computed get linksAsArray(): ReadonlyArray<IBlockLink> {
        return PositionalArrays.toArray(this._links);
    }

    @computed get mutation() {
        return this._mutation;
    }

    // FIXME: setContentAndItems method that does everything in one mutation....
    // the only operations we need are insert and remove with items.

    @action setContent(content: C | IBlockContent) {

        const equals = () => {
            // note this is not a set-theoretic comparison - order matters.
            return deepEqual(this._content, content);
        }

        if (! equals()) {
            // FIXME: only update the content if it's actually different than the current content...
            this._content.update(content);
            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
            return true;
        } else {}

        return

    }

    @action setParent(id: BlockIDStr): boolean {

        if (this._parent !== id) {
            this._parent = id;
            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
            return true;
        } else {
            return false;
        }

    }

    @action setItems(items: ReadonlyArray<BlockIDStr>): boolean {

        const equals = () => {
            // note this is not a set-theoretic comparison - order matters.
            return deepEqual(PositionalArrays.toArray(this._items), items);
        }

        if (! equals()) {
            PositionalArrays.set(this._items, items);
            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
            return true;
        } else {
            return false;
        }

    }

    @action addItem(id: BlockIDStr, pos?: INewChildPosition | 'unshift'): boolean {

        if (! this.hasItem(id)) {

            if (pos === 'unshift') {
                PositionalArrays.unshift(this._items, id);
            } else if (pos) {
                PositionalArrays.insert(this._items, pos.ref, id, pos.pos);
            } else {
                PositionalArrays.append(this._items, id);
            }

            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;

            return true;

        } else {
            return false;
        }

    }

    @action removeItem(id: BlockIDStr): boolean {

        if (this.hasItem(id)) {

            PositionalArrays.remove(this._items, id);

            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
            return true;

        } else {
            return false;
        }

    }

    @action putItem(key: PositionalArrayPositionStr, id: BlockIDStr): boolean {

        if (! this.hasItem(id)) {

            PositionalArrays.put(this._items, key, id);

            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;

            return true;

        } else {
            return false;
        }

    }

    public hasItem(id: BlockIDStr): boolean {
        return PositionalArrays.toArray(this._items).includes(id);
    }

    @action setLinks(links: ReadonlyArray<IBlockLink>) {



        PositionalArrays.set(this._links, links);
        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;
    }

    @action addLink(link: IBlockLink) {

        if (! this.hasLink(link.id)) {
            PositionalArrays.append(this._links, link);
            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
            return true;
        } else {
            return false;
        }

    }

    public hasLink(id: BlockIDStr): boolean {

        return arrayStream(PositionalArrays.toArray(this._links)).
                filter(current => current.id === id)
                .first() !== undefined;

    }

    @action removeLink(id: BlockIDStr): boolean {

        const link =
            arrayStream(Object.values(this._links))
                .filter(current => current.id === id)
                .first();

        if (link) {
            PositionalArrays.remove(this._links, link);
            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
            return true;
        } else {
            return false;
        }

    }

    @action set(block: IBlock) {

        this._parent = block.parent;
        this._created = block.created;
        this._updated = block.updated;
        PositionalArrays.set(this._items, block.items);
        this._content.update(block.content)
        PositionalArrays.set(this._links, block.links);

        // the mutation still has to be incremented here, even in an undo
        // operation because technically the content has been mutated again.
        this._mutation = this._mutation + 1;

    }

    public toJSON(): IBlock<C> {

        return {
            id: this._id,
            nspace: this._nspace,
            uid: this._uid,
            parent: this._parent,
            created: this._created,
            updated: this._updated,
            items: {...this._items},
            content: this._content.toJSON() as any,
            links: {...this._links},
            mutation: this._mutation
        };

    }

}
