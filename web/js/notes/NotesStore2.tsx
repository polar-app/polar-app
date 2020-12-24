import {createReactiveStore} from "../react/store/ReactiveStore";
import { makeObservable, makeAutoObservable, observable, action, computed } from "mobx"
import {NavPosition, NoteContent, StringSetMap} from "./NotesStore";
import { IDStr } from "polar-shared/src/util/Strings";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

export type NoteIDStr = IDStr;
export type NoteNameStr = string;

export type NoteType = 'item' | 'named';

export type NotesIndex = Readonly<{[id: string /* NoteIDStr */]: Note}>;
export type NotesIndexByName = Readonly<{[name: string /* NoteNameStr */]: Note}>;

export type ReverseNotesIndex = Readonly<{[id: string /* NoteIDStr */]: ReadonlyArray<NoteIDStr>}>;

class Note {

    @observable private _id: string;

    @observable private _created: ISODateTimeString;

    @observable private _updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    @observable private _items?: ReadonlyArray<NoteIDStr>;

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    @observable private _content: NoteContent;

    /**
     * The linked wiki references to other notes.
     */
    @observable private _links?: ReadonlyArray<NoteIDStr>;

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

    constructor(id: string,
                created: ISODateTimeString,
                updated: ISODateTimeString,
                items: ReadonlyArray<NoteIDStr>,
                content: string,
                links: ReadonlyArray<NoteIDStr>,
                type: NoteType) {

        this._id = id;
        this._created = created;
        this._updated = updated;
        this._items = items;
        this._content = content;
        this._links = links;
        this._type = type;

        makeObservable(this)
    }

    @computed get id() {
        return this._id;
    }

    @computed get created() {
        return this._created;
    }

    @computed get updated() {
        return this._updated;
    }

    @computed get items() {
        return this._items;
    }

    @computed get content() {
        return this._content;
    }

    @computed get links() {
        return this._links;
    }

    @computed get type() {
        return this._type;
    }

    @action setContent(content: string) {
        this._content = content;
    }

}

// FIXME can I use an observer as a hook?

class NotesStore {

    @observable private _index: NotesIndex = {};

    @observable private _indexByName: NotesIndex = {};

    /**
     * The reverse index so that we can build references to this node.
     */
    @observable private _reverse: ReverseNotesIndex = {};



    /**
     * The current root note
     */
    @observable private _root: NoteIDStr | undefined;

    /**
     * The currently active note.
     */
    @observable private _active: NoteIDStr | undefined;

    /**
     * The position to place the cursor when we jump between items.
     */
    @observable private _activePos: NavPosition = 'start';

    /**
     * The nodes that are expanded.
     */
    @observable private _expanded: StringSetMap = {};


    /**
     * The nodes that are selected by the user.
     */
    @observable private _selected: StringSetMap = {};


    constructor() {
        makeAutoObservable(this);
    }

    public getNote(id: NoteIDStr): Note | undefined {
        return this._index[id] || undefined;
    }

    public getActiveNote(id: NoteIDStr): Note | undefined {

        const active = this._active;

        if ( ! active) {
            return undefined;
        }

        return this._index[id] || undefined;
    }

    //
    // @action addNote(note: Note) {
    //     this.notes.push(note);
    // }

}

const [NotesStoreProvider, useNotesStore] = createReactiveStore(() => new NotesStore())