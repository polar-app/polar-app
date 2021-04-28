import {IBlock, IBlockLink, NamespaceIDStr, TMutation, UIDStr} from "./IBlock";
import {INewChildPosition, BlockIDStr, BlockContent, IBlockContent} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import { Contents } from "../content/Contents";
import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;
import { arrayStream } from "polar-shared/src/util/ArrayStreams";

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
        this._items = PositionalArrays.create([...opts.items]);
        this._content = Contents.create(opts.content);
        this._links = PositionalArrays.create([...opts.links]);
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

    @computed get items(): ReadonlyArray<BlockIDStr> {
        return PositionalArrays.toArray(this._items);
    }

    @computed get content() {
        return this._content;
    }

    @computed get links(): ReadonlyArray<IBlockLink> {
        return PositionalArrays.toArray(this._links);
    }

    @computed get mutation() {
        return this._mutation;
    }

    @action setContent(content: C | IBlockContent) {

        this._content.update(content);
        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;

    }

    @action setParent(id: BlockIDStr) {
        this._parent = id;
        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;
    }

    @action setItems(items: ReadonlyArray<BlockIDStr>) {
        PositionalArrays.set(this._items, items);
        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;
    }

    @action addItem(id: BlockIDStr, pos?: INewChildPosition | 'unshift') {

        if (pos === 'unshift') {
            PositionalArrays.unshift(this._items, id);
        } else if (pos) {
            PositionalArrays.insert(this._items, pos.ref, id, pos.pos);
        } else {
            PositionalArrays.append(this._items, id);
        }

        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;
    }

    @action removeItem(id: BlockIDStr) {

        PositionalArrays.remove(this._items, id);

        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;

    }

    @action setLinks(links: ReadonlyArray<IBlockLink>) {
        PositionalArrays.set(this._links, links);
        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;
    }

    @action addLink(link: IBlockLink) {
        PositionalArrays.append(this._links, link);
        this._updated = ISODateTimeStrings.create();
        this._mutation = this._mutation + 1;
    }

    @action removeLink(id: BlockIDStr) {

        const link =
            arrayStream(Object.values(this._links))
                .filter(current => current.id === id)
                .first();

        if (link) {
            PositionalArrays.remove(this._links, link);
            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
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
            items: PositionalArrays.toArray(this._items),
            content: this._content.toJSON() as any,
            links: PositionalArrays.toArray(this._links),
            mutation: this._mutation
        };

    }

}
