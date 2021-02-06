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

    readonly clearSelection: () => void;

}


export namespace NoteEditorMutators {

    export function createForEditor(editor: IEditor): INoteEditorMutator {

        function getCursorPosition(): CursorPosition {
            return computeEditorCursorPosition(editor);
        }

        function setCursorPosition(offset: number | 'before' | 'end') {

            const doc = editor.model.document;

            // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#function-getRoot
            const root = doc.getRoot();

            editor.model.change((writer: IWriter) => {

                if (typeof offset === 'number') {

                    const doc = editor.model.document;

                    const root = doc.getRoot();

                    editor.model.change((writer) => {

                        const position = writer.createPositionFromPath(root, [0, offset])

                        const range = writer.createRange(position, position);

                        writer.setSelection(range);

                    });

                } else {
                    writer.setSelection(root, offset)
                }

            });

        }

        function setData(data: string): void {
            editor.setData(data);
        }

        function split(): IEditorSplit {
            return doEditorSplit(editor);
        }

        function focus(): void {
            editor.editing.view.focus();
        }

        function clearSelection() {

            editor.model.change((writer) => {

                const pos = editor.model.document.selection.getFirstPosition();

                if (pos) {
                    const range = writer.createRange(pos, pos);
                    writer.setSelection(range);
                }

            });

        }

        return {getCursorPosition, setCursorPosition, setData, split, focus, clearSelection};

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

    public clearSelection(): void {
        // noop
    }

}
