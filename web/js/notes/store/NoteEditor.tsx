
export type ICursorPosition = 'start' | 'end' | 'within';

interface IEditorSplit {
    readonly prefix: string;
    readonly suffix: string;
}

interface INoteEditor {

    /**
     * The the position of the cursor in the editor.
     */
    readonly getCursorPosition: () => ICursorPosition;

    /**
     * Split the editor at the cursor with a prefix of before and after the
     * cursor.
     */
    readonly split: () => IEditorSplit;

    /**
     * Set the data of the current note.
     */
    readonly setData: (data: string) => void;

}


export class NoteEditor {

}