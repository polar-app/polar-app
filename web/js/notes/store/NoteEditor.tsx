import IEditor = ckeditor5.IEditor;
import {computeEditorCursorPosition} from "../editor/UseEditorCursorPosition";
import {doEditorSplit} from "../editor/UseEditorSplitter";

export type CursorPosition = 'start' | 'end' | 'within';

export interface IEditorSplit {
    readonly prefix: string;
    readonly suffix: string;
}

export interface INoteEditor {

    /**
     * The the position of the cursor in the editor.
     */
    readonly getCursorPosition: () => CursorPosition;

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

    constructor(private readonly editor: IEditor) {

    }

    public getCursorPosition(): CursorPosition {
        return computeEditorCursorPosition(this.editor);
    }

    public setData(data: string): void {
        this.editor.setData(data);
    }

    public split(): IEditorSplit {
        return doEditorSplit(this.editor);
    }

}

export class MockNoteEditor implements INoteEditor {

    private cursorPosition: CursorPosition = 'start';

    private data: string = "";

    public getCursorPosition(): CursorPosition {
        return this.cursorPosition;
    }

    public setData(data: string): void {
        this.data = data;
    }

    public split(): IEditorSplit {

        return {
            prefix: '',
            suffix: this.data
        };

    }

}