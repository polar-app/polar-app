import {IBlock, NamespaceIDStr, UIDStr} from "./IBlock";
import {INewChildPosition, BlockContent, BlockIDStr, BlockType} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import {IMarkdownContent} from "../content/IMarkdownContent";
import {INameContent} from "../content/INameContent";

export class Block implements IBlock {

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

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    @observable private _content: BlockContent;

    /**
     * The linked wiki references to other blocks.
     */
    @observable private _links: BlockIDStr[];

    // FIXMEL this needs to be refactoed because
    // the content type of the node should/could change and we need markdown/latex/etc block types
    // but also we need the ability to do block embeds an so forth and those are a specific block type.

    // FIXME: maybe content would be a reference to another type..

    constructor(opts: IBlock) {

        this._id = opts.id;
        this._nspace = opts.nspace;
        this._uid = opts.uid;
        this._parent = opts.parent;
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = [...opts.items];
        this._content = opts.content;
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

    @action setContent(content: BlockContent) {

        // if (content.startsWith('<p')) {
        //     throw new Error("Content was set as HTML!");
        // }

        this._content = content;
        this._updated = ISODateTimeStrings.create();

        // console.log(`Note updated ${this.id}:  ${this.content}`);

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

    public toJSON(): IBlock {

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
