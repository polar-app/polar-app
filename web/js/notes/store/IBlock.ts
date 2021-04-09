import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";
import {NoteContent, NoteIDStr} from "./BlocksStore";

export interface IBlock {

    readonly id: NoteIDStr;

    readonly parent: NoteIDStr | undefined;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items: ReadonlyArray<NoteIDStr>;

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    readonly content: NoteContent;

    /**
     * The linked wiki references to other notes.
     */
    readonly links: ReadonlyArray<NoteIDStr>;

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
    readonly type: 'item' | 'named';

}
