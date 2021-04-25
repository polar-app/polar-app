import {IBlock, NamespaceIDStr, UIDStr} from "./IBlock";
import {INewChildPosition, BlockIDStr, BlockContent, IBlockContent} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import { Contents } from "../content/Contents";
import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;

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
    @observable private _links: PositionalArray<BlockIDStr>;

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

    @computed get links(): ReadonlyArray<BlockIDStr> {
        return PositionalArrays.toArray(this._links);
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
        PositionalArrays.set(this._items, items);
        this._updated = ISODateTimeStrings.create();
    }

    @action addItem(id: BlockIDStr, pos?: INewChildPosition | 'first-child') {

        if (pos === 'first-child') {

            PositionalArrays.unshift(this._items, id);

        } else if (pos) {
            PositionalArrays.insert(this._items, pos.ref, id, pos.pos);
        } else {
            PositionalArrays.append(this._items, id);
        }

        this._updated = ISODateTimeStrings.create();
    }

    @action removeItem(id: BlockIDStr) {

        PositionalArrays.remove(this._items, id);

        this._updated = ISODateTimeStrings.create();

    }

    @action setLinks(links: ReadonlyArray<BlockIDStr>) {
        PositionalArrays.set(this._links, links);
        this._updated = ISODateTimeStrings.create();
    }

    @action addLink(id: BlockIDStr) {
        PositionalArrays.append(this._links, id);
        this._updated = ISODateTimeStrings.create();
    }

    @action removeLink(id: BlockIDStr) {

        PositionalArrays.remove(this._links, id);
        this._updated = ISODateTimeStrings.create();

    }

    @action set(block: IBlock) {

        this._parent = block.parent;
        this._created = block.created;
        this._updated = block.updated;
        PositionalArrays.set(this._items, block.items);
        this._content.update(block.content)
        PositionalArrays.set(this._links, block.links);

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
        };

    }

}
