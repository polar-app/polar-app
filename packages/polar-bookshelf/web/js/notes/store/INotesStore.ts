import {INoteActivated, NavOpts, NavPosition, NoteIDStr, StringSetMap} from "./BlocksStore";
import {INote} from "./INote";
import {Note} from "./Note";
import {NoteTargetStr} from "../NoteLinkLoader";

export interface INotesStore {

    selected: StringSetMap;

    clearSelected(reason: string): void;

    lookup(notes: ReadonlyArray<NoteIDStr>): ReadonlyArray<INote>;
    lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr>;
    pathToNote(id: NoteIDStr): ReadonlyArray<Note>;

    doDelete(noteIDs: ReadonlyArray<NoteIDStr>): void;
    setActive(active: NoteIDStr | undefined): void;

    setRoot(root: NoteIDStr | undefined): void;

    getNoteByTarget(target: NoteIDStr | NoteTargetStr): Note | undefined;

    getNoteActivated(id: NoteIDStr): INoteActivated | undefined;

    getNote(id: NoteIDStr): Note | undefined;

    setActiveWithPosition(active: NoteIDStr | undefined,
                          activePos: NavPosition | undefined): void;

}
