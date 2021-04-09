import {INote} from "./INote";
import {INewChildPosition, NoteContent, NoteIDStr, NoteType} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";

export class Note implements INote {

    @observable private _id: NoteIDStr;

    @observable private _parent: NoteIDStr | undefined;

    @observable private _created: ISODateTimeString;

    @observable private _updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    @observable private _items: NoteIDStr[];

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    @observable private _content: NoteContent;

    /**
     * The linked wiki references to other notes.
     */
    @observable private _links: NoteIDStr[];

    // FIXMEL this needs to be refactoed because
    // the content type of the node should/could change and we need markdown/latex/etc note types
    // but also we need the ability to do block embeds an so forth and those are a specic note type.
    // FIXME: maybe content would be a reference to another type..

    /**
     * There are two types of notes.  One is just an 'item' where the 'content'
     * is the body of the item and isn't actually a unique name and then there
     * is a 'named' note where the content is actually the name of the note and
     * has constrained semantics (can't have a link, image, etc.
     */
    @observable private _type: NoteType;

    constructor(opts: INote) {

        this._id = opts.id;
        this._parent = opts.parent;
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = [...opts.items];
        this._content = opts.content;
        this._links = [...opts.links];
        this._type = opts.type;

        makeObservable(this)

    }

    @computed get id() {
        return this._id;
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

    @computed get items(): ReadonlyArray<NoteIDStr> {
        return this._items;
    }

    @computed get content() {
        return this._content;
    }

    @computed get links(): ReadonlyArray<NoteIDStr> {
        return this._links;
    }

    @computed get type() {
        return this._type;
    }

    @action setContent(content: string) {

        // if (content.startsWith('<p')) {
        //     throw new Error("Content was set as HTML!");
        // }

        this._content = content;
        this._updated = ISODateTimeStrings.create();

        // console.log(`Note updated ${this.id}:  ${this.content}`);

    }

    @action setParent(id: NoteIDStr) {
        this._parent = id;
        this._updated = ISODateTimeStrings.create();
    }

    @action setItems(items: ReadonlyArray<NoteIDStr>) {
        this._items = [...items];
        this._updated = ISODateTimeStrings.create();
    }

    @action addItem(id: NoteIDStr, pos?: INewChildPosition | 'first-child') {

        if (pos === 'first-child') {

            this._items.unshift(id);

        } else if (pos) {

            const idx = this._items.indexOf(pos.ref);

            if (idx !== -1) {
                const delta = pos.pos === 'before' ? 0 : 1;
                this._items.splice(idx + delta, 0, id);
            }

        } else {
            this._items.push(id);
        }

        this._updated = ISODateTimeStrings.create();
    }

    @action removeItem(id: NoteIDStr) {

        const idx = this.items.indexOf(id);

        if (idx === -1) {
            return;
        }

        // this mutates the array under us and I don't necessarily like that
        // but it's a copy of the original to begin with.
        this._items.splice(idx, 1);
        this._updated = ISODateTimeStrings.create();

    }

    @action setLinks(links: ReadonlyArray<NoteIDStr>) {
        this._links = [...links];
        this._updated = ISODateTimeStrings.create();
    }

    @action addLink(id: NoteIDStr) {
        this._links.push(id);
        this._updated = ISODateTimeStrings.create();
    }

    @action removeLink(id: NoteIDStr) {

        const idx = this._links.indexOf(id);

        if (idx === -1) {
            return;
        }

        // this mutates the array under us and I don't necessarily like that
        // but it's a copy of the original to begin with.
        this._links.splice(idx, 1);
        this._updated = ISODateTimeStrings.create();

    }

}
