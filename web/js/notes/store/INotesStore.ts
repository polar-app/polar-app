import {INoteActivated, NavOpts, NavPosition, NoteIDStr, StringSetMap} from "./BlocksStore";
import {IBlock} from "./IBlock";
import {Block} from "./Block";
import {NoteTargetStr} from "../NoteLinkLoader";

export interface INotesStore {

    selected: StringSetMap;

    clearSelected(reason: string): void;

    lookup(notes: ReadonlyArray<NoteIDStr>): ReadonlyArray<IBlock>;
    lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr>;
    pathToNote(id: NoteIDStr): ReadonlyArray<Block>;

    doDelete(noteIDs: ReadonlyArray<NoteIDStr>): void;
    setActive(active: NoteIDStr | undefined): void;

    setRoot(root: NoteIDStr | undefined): void;

    getNoteByTarget(target: NoteIDStr | NoteTargetStr): Block | undefined;

    getNoteActivated(id: NoteIDStr): INoteActivated | undefined;

    getNote(id: NoteIDStr): Block | undefined;

    setActiveWithPosition(active: NoteIDStr | undefined,
                          activePos: NavPosition | undefined): void;

}
