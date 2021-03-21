import * as React from "react";

export type CursorPosition = 'start' | 'end' | 'within';

export interface IEditorSplit {
    readonly prefix: string;
    readonly suffix: string;
}

export interface INoteEditorMutator {

    /**
     * The the position of the cursor in the editor.
     */
    readonly getCursorPosition: () => CursorPosition;

    readonly setCursorPosition: (offset: number | 'before' | 'end') => void;

    /**
     * Split the editor at the cursor with a prefix of before and after the
     * cursor.
     */
    readonly split: () => IEditorSplit;

    /**
     * Set the data of the current note.
     */
    readonly setData: (data: string) => void;

    readonly focus: () => void;

    readonly clearSelection: () => void;

}


export namespace NoteEditorMutators {

}

export class MockNoteEditorMutator implements INoteEditorMutator {

    private cursorPosition: CursorPosition = 'start';

    private data: string = "";

    public getCursorPosition(): CursorPosition {
        return this.cursorPosition;
    }

    public setCursorPosition(offset: number | 'before' | 'end') {
        // noop for now
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

    public focus(): void {
        // noop
    }

    public clearSelection(): void {
        // noop
    }

}
