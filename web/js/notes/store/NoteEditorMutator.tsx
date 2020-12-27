import IEditor = ckeditor5.IEditor;
import {computeEditorCursorPosition} from "../editor/UseEditorCursorPosition";
import {doEditorSplit} from "../editor/UseEditorSplitter";
import * as React from "react";
import IWriter = ckeditor5.IWriter;

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

}

export class NoteEditorMutator implements INoteEditorMutator {

    constructor(private readonly editor: IEditor) {

    }

    public getCursorPosition(): CursorPosition {
        return computeEditorCursorPosition(this.editor);
    }

    public setCursorPosition(offset: number | 'before' | 'end') {

        const doc = this.editor.model.document;

        // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#function-getRoot
        const root = doc.getRoot();

        this.editor.model.change((writer: IWriter) => {
            writer.setSelection(root, offset)
        });

    }

    public setData(data: string): void {
        this.editor.setData(data);
    }

    public split(): IEditorSplit {
        return doEditorSplit(this.editor);
    }

    public focus(): void {
        this.editor.editing.view.focus();
    }

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

}